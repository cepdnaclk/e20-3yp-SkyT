const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const chokidar = require('chokidar');

// Configuration
const sourceFolder = path.join(__dirname, 'images-to-upload');
const serverUrl = 'http://localhost:3000/upload';
const processedLogFile = path.join(__dirname, 'processed-files.json');

// Create source folder if it doesn't exist
if (!fs.existsSync(sourceFolder)) {
  fs.mkdirSync(sourceFolder, { recursive: true });
  console.log(`Created source folder: ${sourceFolder}`);
}

// Initialize or load processed files log
let processedFiles = {};
if (fs.existsSync(processedLogFile)) {
  try {
    const data = fs.readFileSync(processedLogFile, 'utf8');
    processedFiles = JSON.parse(data);
    console.log(`Loaded ${Object.keys(processedFiles).length} processed files from log`);
  } catch (err) {
    console.error('Error loading processed files log:', err);
    processedFiles = {};
  }
}

// Save processed files to log
function saveProcessedFiles() {
  try {
    fs.writeFileSync(processedLogFile, JSON.stringify(processedFiles, null, 2));
  } catch (err) {
    console.error('Error saving processed files log:', err);
  }
}

// Upload a single file
async function uploadFile(filePath) {
  const filename = path.basename(filePath);
  
  // Check if file was already processed
  if (processedFiles[filePath]) {
    console.log(`Skipping ${filename} (already processed)`);
    return;
  }
  
  console.log(`Preparing to upload: ${filename}`);
  
  try {
    // Check if file exists and is readable
    await fs.promises.access(filePath, fs.constants.R_OK);
    
    // Create form data
    const formData = new FormData();
    formData.append('images', fs.createReadStream(filePath));
    
    // Upload file
    console.log(`Uploading ${filename}...`);
    const response = await axios.post(serverUrl, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    if (response.data.success) {
      console.log(`Successfully uploaded ${filename}`);
      console.log(`URL: ${response.data.files[0].url}`);
      
      // Mark as processed
      processedFiles[filePath] = {
        uploadedAt: new Date().toISOString(),
        serverPath: response.data.files[0].url
      };
      saveProcessedFiles();
    } else {
      console.error(`Failed to upload ${filename}: ${response.data.message}`);
    }
  } catch (error) {
    console.error(`Error uploading ${filename}:`, error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

// Batch upload all files in the folder
async function uploadAllFiles() {
  try {
    const files = await fs.promises.readdir(sourceFolder);
    const imageFiles = files.filter(file => {
      return /\.(jpg|jpeg|png|gif)$/i.test(file);
    });
    
    console.log(`Found ${imageFiles.length} image files to process`);
    
    for (const file of imageFiles) {
      const filePath = path.join(sourceFolder, file);
      await uploadFile(filePath);
    }
    
    console.log('Finished processing all files');
  } catch (error) {
    console.error('Error reading source folder:', error);
  }
}

// Set up file watcher
function setupWatcher() {
  console.log(`Watching for new images in ${sourceFolder}`);
  
  const watcher = chokidar.watch(sourceFolder, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  watcher
    .on('add', async filePath => {
      if (/\.(jpg|jpeg|png|gif)$/i.test(filePath)) {
        console.log(`New image detected: ${path.basename(filePath)}`);
        await uploadFile(filePath);
      }
    })
    .on('error', error => console.error(`Watcher error: ${error}`));
  
  console.log('Watcher started. Press Ctrl+C to stop.');
}

// Main function
async function main() {
  // Initial upload of all existing files
  await uploadAllFiles();
  
  // Then start watching for new files
  setupWatcher();
}

// Start the client
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
