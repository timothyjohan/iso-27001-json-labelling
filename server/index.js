const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs-extra'); // Use fs-extra for file operations
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());


app.post('/submit', async (req, res) => {
    const json = req.body;
  
    const jsonlPath = path.join(__dirname, 'data', 'datasetv1.jsonl');
  
    try {
      // Convert object to JSON line
      const jsonLine = JSON.stringify(json) + '\n';
  
      // Append to the file
      await fs.ensureFile(jsonlPath); // Make sure file exists
      await fs.appendFile(jsonlPath, jsonLine, 'utf8');
  
      res.status(200).json({ success: true, message: 'JSON appended.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to write to file.' });
    }
  });

  app.post('/upload', upload.single('file'), async (req, res) => {
    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
  
    try {
      let rawText = '';
  
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        rawText = data.text;
      } else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        rawText = result.value;
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: 'Unsupported file type' });
      }
  
      fs.unlinkSync(filePath);
  
      // 🧼 Sanitize smart quotes
      const cleanText = sanitizeText(rawText);
  
      res.json({ text: cleanText });
  
    } catch (err) {
      fs.unlinkSync(filePath);
      res.status(500).json({ error: 'Failed to extract text' });
    }
  });
  

app.listen(3001, () => console.log('Server running on http://localhost:3001'));

function sanitizeText(text) {
    return text
      .replace(/[‘’]/g, "'")   // smart single quotes → normal
      .replace(/[“”]/g, '"');  // smart double quotes → normal
  }
  