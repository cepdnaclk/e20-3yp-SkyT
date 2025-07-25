require('dotenv').config({ path: '/home/raspi/image-server/.env' });
console.log('ENV LOADED:', process.env.DB_HOST, process.env.PORT);
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const serverUrl = process.env.SERVER_URL;

// Enable CORS
// Add middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Direct database connection function
async function getDBConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

// Authentication middleware with Access Denied HTML
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const denyAccessPage = () => {
  res.status(403).sendFile(path.join(__dirname, 'public/access-denied.html'));
  };

  if (!authHeader) return denyAccessPage();

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return denyAccessPage();

  const token = parts[1];
  
  let connection;
  try {
    connection = await getDBConnection();

    const [rows] = await connection.query(
      'SELECT * FROM API_KEYS WHERE api_key = ? AND status = ? AND (expires_at IS NULL OR expires_at > NOW())',
      [token, 'active']
    );

    if (rows.length === 0) return denyAccessPage();

    const apiKeyRecord = rows[0];

    await connection.query(
      'UPDATE API_KEYS SET last_used = NOW() WHERE api_key = ?',
      [token]
    );

    req.user = {
      apiKeyId: apiKeyRecord.id,
      apiKey: apiKeyRecord.api_key,
      name: apiKeyRecord.name,
      permissions: apiKeyRecord.permissions,
      createdBy: apiKeyRecord.created_by
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication service error' 
    });
  } finally {
    if (connection) await connection.end();
  }
};

// Endpoint to get images by nodeId
app.get('/images/node/:nodeId', authenticateToken, async (req, res) => {
  let connection;
  try {
    const nodeId = req.params.nodeId;
    connection = await getDBConnection();

    const [rows] = await connection.query('SELECT * FROM NODE_IMAGES WHERE nodeId = ? ORDER BY uploadedAt DESC', [nodeId]);

    const imageData = rows.map(img => ({
      imageId: img.imageId,
      nodeId: img.nodeId,
      url: img.url,
      uploadedAt: img.uploadedAt
    }));

    res.json({ success: true, count: rows.length, images: imageData });
  } catch (error) {
    console.error('Get node images error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Use original filename but add timestamp to prevent duplicates
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.originalname;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// Create multer upload instance with file filtering
const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

// Serve the uploads directory statically
app.use('/uploads', authenticateToken, express.static(path.join(__dirname, 'uploads')));

// Endpoint to handle file uploads
app.post('/upload', authenticateToken, upload.single('images'), async (req, res) => {
  let connection;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const nodeId = req.body.nodeId || req.query.nodeId || 1;
    const { filename, path: filePath } = req.file;
    const fileUrl = `uploads/${filename}`;

    // Debug logging
    console.log('File upload details:', {
      filename,
      filePath,
      fileUrl,
      nodeId,
      fileExists: fs.existsSync(filePath)
    });

    // Verify file was actually saved
    if (!fs.existsSync(filePath)) {
      throw new Error(`Uploaded file not found at ${filePath}`);
    }

    connection = await getDBConnection();
    const sql = `INSERT INTO NODE_IMAGES (nodeId, url) VALUES (?, ?)`;
    const [result] = await connection.query(sql, [nodeId, fileUrl]);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      imageId: result.insertId,
      file: {
        imageId: result.insertId,
        nodeId: nodeId,
        url: fileUrl,
        uploadedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to get an image by ID
app.get('/image/:id', authenticateToken, async (req, res) => {
  let connection;
  try {
    const imageId = req.params.id;
    connection = await getDBConnection();

    const [rows] = await connection.query('SELECT * FROM NODE_IMAGES WHERE imageId = ?', [imageId]);
    const image = rows[0];

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.json({
      success: true,
      image: {
        imageId: image.imageId,
        nodeId: image.nodeId,
        url: image.url,
        uploadedAt: image.uploadedAt
      }
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to list all uploaded images
app.get('/images', authenticateToken, async (req, res) => {
  let connection;
  try {
    const nodeId = req.query.nodeId;
    let query = 'SELECT * FROM NODE_IMAGES ORDER BY uploadedAt DESC';
    let params = [];

    if (nodeId) {
      query = 'SELECT * FROM NODE_IMAGES WHERE nodeId = ? ORDER BY uploadedAt DESC';
      params = [nodeId];
    }

    connection = await getDBConnection();
    const [rows] = await connection.query(query, params);

    const imageData = rows.map(img => ({
      imageId: img.imageId,
      nodeId: img.nodeId,
      url: img.url,
      uploadedAt: img.uploadedAt
    }));

    res.json({ success: true, count: rows.length, images: imageData });
  } catch (error) {
    console.error('List images error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to get task for drone
app.get('/task/:droneId', authenticateToken, async (req, res) => {
  let connection;
  try {
    const droneId = req.params.droneId;
    connection = await getDBConnection();

    // Get drone info
    const [droneRows] = await connection.query('SELECT type, estateId FROM DRONES WHERE droneId = ?', [droneId]);
    
    if (droneRows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: `Drone ID ${droneId} not found` 
      });
    }

    const { type: droneType, estateId } = droneRows[0];

    // Get matching tasks (add taskId to SELECT)
    const [taskRows] = await connection.query(`
      SELECT taskId, lots, dueDate, dueTime
      FROM TASKS
      WHERE tag = ? AND status = 'Pending' AND estateId = ?
    `, [droneType, estateId]);

    if (taskRows.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'No matching pending tasks found' 
      });
    }

    const now = new Date();

    function combinedDueDateTime(task) {
      const dueDate = new Date(task.dueDate);
      const dueTime = task.dueTime;
      
      let hours = 0, minutes = 0, seconds = 0;
      
      if (typeof dueTime === 'string') {
        const timeParts = dueTime.split(':');
        hours = parseInt(timeParts[0]) || 0;
        minutes = parseInt(timeParts[1]) || 0;
        seconds = parseInt(timeParts[2]) || 0;
      } else if (dueTime instanceof Date) {
        hours = dueTime.getHours();
        minutes = dueTime.getMinutes();
        seconds = dueTime.getSeconds();
      }
      
      dueDate.setHours(hours, minutes, seconds, 0);
      return dueDate;
    }

    // Helper function to check if two dates are on the same day
    function isSameDate(date1, date2) {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    }

    // Filter tasks to only include those due today
    const todayTasks = taskRows.filter(task => {
      const taskDueDate = new Date(task.dueDate);
      return isSameDate(taskDueDate, now);
    });

    // Select closest task from today's tasks only
    let closestTask = null;
    
    if (todayTasks.length > 0) {
        closestTask = todayTasks.reduce((closest, current) => {
        const currentDiff = Math.abs(combinedDueDateTime(current) - now);
        const closestDiff = Math.abs(combinedDueDateTime(closest) - now);
        return currentDiff < closestDiff ? current : closest;
      });
      
      console.log("Closest task for today:", closestTask);
    } else {
      return res.status(404).json({
      status: 'error',
      message: 'No tasks due today'
      });
    }

    const lotsJson = closestTask.lots;

    let lotIds;
    try {
      lotIds = typeof lotsJson === 'string' ? JSON.parse(lotsJson) : lotsJson;
    } catch (parseError) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Invalid lot IDs format in task' 
      });
    }

    if (!lotIds || lotIds.length === 0) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'No lot IDs found in task' 
      });
    }

    const lotInfoList = [];

    for (const lotId of lotIds) {
      const [lotRows] = await connection.query('SELECT lat, lng FROM LOTS WHERE lotId = ?', [lotId]);
      if (lotRows.length === 0) continue;

      const { lat: lotLat, lng: lotLng } = lotRows[0];

      const [nodeRows] = await connection.query(
        'SELECT nodeId, lat, lng, mac_address, char_uuid FROM NODES WHERE lotId = ? AND status = ?',
        [lotId, 'Active']
      );

      const nodeData = nodeRows.map(node => ({
        nodeId: node.nodeId,
        lat: node.lat,
        lng: node.lng,
        mac_address: node.mac_address,
        char_UUID: node.char_uuid
      }));

      lotInfoList.push({
        lotId: lotId,
        lat: lotLat,
        lng: lotLng,
        nodes: nodeData
      });
    }

    res.json({
      status: 'success',
      droneId: droneId,
      taskId: closestTask.taskId,
      lots: lotInfoList
    });

  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to update task status
app.post('/task/:taskId', authenticateToken, async (req, res) => {
  let connection;
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing task status in request body'
      });
    }

    connection = await getDBConnection();

    // Check if the task exists
    const [taskRows] = await connection.query('SELECT taskId FROM TASKS WHERE taskId = ?', [taskId]);

    if (taskRows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: `Task ID ${taskId} not found`
      });
    }

    // Update task status
    await connection.query('UPDATE TASKS SET status = ? WHERE taskId = ?', [status, taskId]);

    res.json({
      status: 'success',
      message: `Task ID ${taskId} updated with status '${status}'`
    });

  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to save sensor readings
app.post('/sensor-readings', authenticateToken, async (req, res) => {
  let connection;
  try {
    const {
      nodeId,
      timestamp,
      temperature,
      humidity,
      ph,
      n,
      p,
      k,
      battery
    } = req.body;

    // Validate required fields
    if (!nodeId) {
      return res.status(400).json({ 
        success: false, 
        message: 'nodeId is required' 
      });
    }

    // Use current timestamp if not provided
    const sensorTimestamp = timestamp ? new Date(timestamp) : new Date();

    connection = await getDBConnection();
    
    const sql = `
      INSERT INTO SENSOR_READINGS 
      (nodeId, timestamp, temperature, humidity, ph, n, p, k, battery) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.query(sql, [
      nodeId,
      sensorTimestamp,
      temperature || null,
      humidity || null,
      ph || null,
      n || null,
      p || null,
      k || null,
      battery || null
    ]);

    res.json({
      success: true,
      message: 'Sensor reading saved successfully',
      data: {
        id: result.insertId,
        nodeId: nodeId,
        timestamp: sensorTimestamp,
        temperature: temperature,
        humidity: humidity,
        ph: ph,
        n: n,
        p: p,
        k: k,
        battery: battery
      }
    });

  } catch (error) {
    console.error('Sensor readings error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to save sensor readings
app.post('/drone-status', authenticateToken, async (req, res) => {
  let connection;
  try {
    const {
      droneId,
      lat,
      lng,
      battery,
      signalStrength,
      altitude,
      speed
    } = req.body;

    // Validate required fields
    if (!droneId) {
      return res.status(400).json({ 
        success: false, 
        message: 'droneId is required' 
      });
    }

    connection = await getDBConnection();
    
    const updateQuery = `
      UPDATE DRONE_STATUS 
      SET lat = ?, lng = ?, battery = ?, signalStrength = ?, altitude = ?, speed = ?
      WHERE droneId = ?
    `;

    const [result] = await connection.execute(updateQuery, [
      lat,
      lng,
      battery || 75,
      signalStrength || 67,
      altitude || null,
      speed || null,
      droneId 
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Drone not found' });
    }
    

    res.json({ success: true, message: 'Drone status updated successfully' });

  } catch (error) {
    console.error('Error updating drone status:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Endpoint to create notifications for employees
app.post('/notifications', authenticateToken, async (req, res) => {
  let connection;
  try {
    let { droneId, title, message, type } = req.body;

    // Validate required fields
    if (!droneId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'droneId, title, and message are required'
      });
    }

    // Default type to droneId is present
    if (!type && droneId) {
      type = 'Drone';
    }

    connection = await getDBConnection();

    // Get estateId from DRONES table
    const [droneRows] = await connection.query(
      'SELECT estateId FROM DRONES WHERE droneId = ?',
      [droneId]
    );

    if (droneRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Drone with ID ${droneId} not found`
      });
    }

    const estateId = droneRows[0].estateId;

    // Get employeeIds from EMPLOYEE table
    const [employeeRows] = await connection.query(
      'SELECT employeeId FROM EMPLOYEES WHERE estateId = ?',
      [estateId]
    );

    if (employeeRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No employees found for estateId ${estateId}`
      });
    }

    // Insert notification for each employee
    const insertQuery = `
      INSERT INTO NOTIFICATIONS (userId, title, message, type)
      VALUES (?, ?, ?, ?)
    `;

    for (const employee of employeeRows) {
      await connection.query(insertQuery, [
        employee.employeeId,
        title,
        message,
        type
      ]);
    }

    res.json({
      success: true,
      message: `Notification sent to ${employeeRows.length} employee(s) for estateId ${estateId}`
    });

  } catch (error) {
    console.error('Notification creation error:', error);
    res.status(500).json({ success: false, message: 'Database error' });
  } finally {
    if (connection) await connection.end();
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const connection = await getDBConnection();
    await connection.execute('SELECT 1'); // Test DB connectivity
    res.status(500).sendFile(path.join(__dirname, 'public/db-connected.html'));
    await connection.end();
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).sendFile(path.join(__dirname, 'public/db-error.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at ${serverUrl}`);
  console.log(`Upload endpoint at ${serverUrl}/upload`);
});