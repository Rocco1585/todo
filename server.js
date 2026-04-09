const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const DB_FILE = 'db.json';

// 👉 Static Files korrekt setzen
app.use(express.static(path.join(__dirname)));

// 👉 Root fix (WICHTIG gegen "Cannot GET /")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Datei sicherstellen
function ensureDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
      templates: [],
      days: {}
    }, null, 2));
  }
}

function loadDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API
app.get('/api/state', (req, res) => {
  res.json(loadDB());
});

app.post('/api/state', (req, res) => {
  saveDB(req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server läuft auf Port " + PORT);
});
