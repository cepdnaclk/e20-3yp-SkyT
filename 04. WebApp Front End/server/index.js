const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Initialize server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

// MySQL connection
const db = mysql.createConnection({
    user: 'admin',
    host: 'database-1.cwt8ikeayy80.us-east-1.rds.amazonaws.com',
    password: 'RDBAWS1234',
    database: 'awsdatabase_1',
});
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// MongoDB connection
const mongoURI = "mongodb+srv://MongoDBUser3YPG11:VYlFFpkaWmqnuPZr@cluster0.78m7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("images.files"); // Collection where images are stored
});

// Multer setup for image upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register route
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;
    const sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';

    db.query(sql, [email, username, password], (err, results) => {
        if (err) {
            return res.send({ error: err });
        }
        res.send({ message: 'User registered successfully!' });
        console.log('User created');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username=? AND password=?';

    db.query(sql, [username, password], (err, results) => {
        if (err) {
            return res.send({ success: false, error: err });
        }
        if (results.length > 0) {
            res.send({ success: true, message: 'Login successful', token: 'dummy-token' });
        } else {
            res.send({ success: false, message: 'Invalid username or password' });
        }
    });
});

// Fetch the latest sensor data
app.get("/api/latest-sensor", (req, res) => {
    const query = "SELECT * FROM sensor_Data ORDER BY time DESC LIMIT 1";
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(result.length > 0 ? result[0] : null);
        }
    });
});

// Endpoint to upload an image to MongoDB (GridFS)
app.post("/api/upload-image", upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const imageBuffer = req.file.buffer;
    const filename = req.file.originalname;
    const contentType = req.file.mimetype;

    const writeStream = gfs.createWriteStream({
        filename: filename,
        content_type: contentType
    });

    writeStream.on('close', (file) => {
        res.json({ message: 'File uploaded successfully', fileId: file._id });
    });

    writeStream.end(imageBuffer);
});

// Endpoint to fetch an image from MongoDB (GridFS) by ID
app.get("/api/image/:imageId", (req, res) => {
    const { imageId } = req.params;

    gfs.files.findOne({ _id: ObjectId(imageId) }, (err, file) => {
        if (err || !file) {
            return res.status(404).json({ error: "Image not found" });
        }

        const readStream = gfs.createReadStream({ _id: file._id });
        res.set("Content-Type", file.contentType);
        readStream.pipe(res);
    });
});

// // Endpoint to fetch the latest image based on lot number (linked to MySQL)
// app.get("/api/latest-image/:lotNumber", (req, res) => {
//     const lotNumber = req.params.lotNumber;

//     // Fetch image_ID from MySQL based on lotNumber
//     const sql = "SELECT image_ID FROM Lot_Images WHERE lot_number = ?";
//     db.query(sql, [lotNumber], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err });
//         }

//         if (results && results.length > 0) {
//             const imageId = results[0].image_ID;

//             // Fetch the image from MongoDB GridFS
//             gfs.files.findOne({ _id: ObjectId(imageId) }, (err, file) => {
//                 if (err || !file) {
//                     return res.status(404).json({ error: "Image not found" });
//                 }

//                 const imageURL = `/api/image/${file._id}`; // URL to fetch the image

//                 res.json({
//                     imageURL: imageURL,
//                     timestamp: new Date().toLocaleTimeString(), // Example timestamp
//                 });
//             });
//         } else {
//             res.status(404).json({ error: "No image found for the given lot number" });
//         }
//     });
// });

app.get("/api/latest-image/:lotNumber", (req, res) => {
  const lotNumber = req.params.lotNumber;
  console.log("Requested lot number:", lotNumber); // Debugging

  const sql = "SELECT image_ID FROM Lot_Images WHERE lot_number = ?";
  db.query(sql, [lotNumber], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err });
      }

      if (results && results.length > 0) {
          const imageId = results[0].image_ID;
          console.log("Fetched image ID:", imageId); // Debugging

          gfs.files.findOne({ _id: ObjectId("67c35f5668c389cc3e432006") }, (err, file) => {
              if (err || !file) {
                  return res.status(404).json({ error: "Image not found" });
              }

              const imageURL = `/api/image/${file._id}`;
              res.json({ imageURL: imageURL, timestamp: new Date().toLocaleTimeString() });
          });
      } else {
          return res.status(404).json({ error: "No image found for the given lot number" });
      }
  });
});
