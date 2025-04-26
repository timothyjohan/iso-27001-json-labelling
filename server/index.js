const express = require('express');
const multer = require('multer');
const cors = require('cors');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

function sanitizeText(text) {
  return text
    .replace(/[‘’]/g, "'")   // smart single quotes → straight
    .replace(/[“”]/g, '"');  // smart double quotes → straight
}

app.post('/submit', async (req, res) => {
  const json = req.body;
  const jsonlPath = path.join(__dirname, 'data', 'datasetv1.jsonl');

  try {
    const jsonLine = JSON.stringify(json) + '\n';
    await fs.ensureFile(jsonlPath);
    await fs.appendFile(jsonlPath, jsonLine, 'utf8');

    res.status(200).json({ success: true, message: 'JSON appended.' });
  } catch (err) {
    console.error('[ERROR] Failed to write JSONL:', err);
    res.status(500).json({ success: false, error: 'Failed to write to file.' });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file?.path;
  const ext = path.extname(req.file?.originalname || '').toLowerCase();

  if (!filePath || !ext) {
    return res.status(400).json({ error: 'No file uploaded or invalid file.' });
  }

  try {
    let rawText = '';

    if (ext === '.pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse(dataBuffer);
      rawText = data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      rawText = result.value;
    } else {
      await fs.unlink(filePath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    await fs.unlink(filePath);
    const cleanText = sanitizeText(rawText);
    res.json({ text: cleanText });

  } catch (err) {
    console.error('[ERROR] Failed to process file:', err);
    if (filePath && await fs.pathExists(filePath)) {
      await fs.unlink(filePath); // Ensure cleanup
    }
    res.status(500).json({ error: 'Failed to extract text' });
  }
});

app.get('/dataset', async (req, res) => {
  const filePath = path.join(__dirname, 'data', 'datasetv1.jsonl');

  try {
    const lines = await fs.readFile(filePath, 'utf8');
    const jsonArray = lines
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line));

    res.json(jsonArray);
  } catch (err) {
    console.error('[ERROR] Reading dataset:', err);
    res.status(500).json({ error: 'Failed to read dataset' });
  }
});

app.post('/update', async (req, res) => {
  const { index, entry } = req.body;
  const jsonlPath = path.join(__dirname, 'data', 'datasetv1.jsonl');

  try {
    let lines = (await fs.readFile(jsonlPath, 'utf8'))
      .split('\n')
      .filter(Boolean); // filter empty lines

    if (index < 0 || index >= lines.length) {
      return res.status(400).json({ success: false, error: 'Invalid index' });
    }

    lines[index] = JSON.stringify(entry); // replace the specific line

    await fs.writeFile(jsonlPath, lines.join('\n') + '\n', 'utf8');

    res.status(200).json({ success: true, message: 'Entry updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update file.' });
  }
});

app.listen(3001, () => {
  console.log('✅ Server running');
});
