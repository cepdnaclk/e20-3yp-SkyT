const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // Add SQLite for simplicity

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Initialize database
const db = new sqlite3.Database('./images.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to the SQLite database');
    // Create images table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Use original filename but add timestamp to prevent duplicates
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to handle file uploads
app.post('/upload', upload.single('images'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Store file info in database
    const { filename, originalname, size, mimetype } = req.file;
    
    const sql = `INSERT INTO images (filename, original_name, size, mime_type) 
                VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [filename, originalname, size, mimetype], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      // Return success with image ID and URL
      const imageId = this.lastID;
      res.json({
        success: true,
        message: 'File uploaded successfully',
        imageId: imageId,
        file: {
          id: imageId,
          filename: filename,
          originalName: originalname,
          size: size,
          url: `http://localhost:${PORT}/uploads/${filename}`
        }
      });
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to get an image by ID
app.get('/image/:id', (req, res) => {
  const imageId = req.params.id;
  
  db.get('SELECT * FROM images WHERE id = ?', [imageId], (err, image) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    
    res.json({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        originalName: image.original_name,
        size: image.size,
        url: `http://localhost:${PORT}/uploads/${image.filename}`,
        createdAt: image.created_at
      }
    });
  });
});

// Endpoint to list all uploaded images
app.get('/images', (req, res) => {
  db.all('SELECT * FROM images ORDER BY created_at DESC', [], (err, images) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    const imageData = images.map(img => ({
      id: img.id,
      filename: img.filename,
      originalName: img.original_name,
      size: img.size,
      url: `http://localhost:${PORT}/uploads/${img.filename}`,
      createdAt: img.created_at
    }));
    
    res.json({
      success: true,
      count: images.length,
      images: imageData
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Upload endpoint at http://localhost:${PORT}/upload`);
});