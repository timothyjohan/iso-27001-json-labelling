const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      fs.unlinkSync(filePath);
      res.json({ text: data.text });
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      fs.unlinkSync(filePath);
      res.json({ text: result.value });
    } else {
      fs.unlinkSync(filePath);
      res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
