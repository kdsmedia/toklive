const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));  // Serve static files from 'public' directory

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Middleware untuk menampilkan background saat halaman utama diakses
app.get('/current-background', (req, res) => {
    const backgroundUrl = '/images/default.jpg'; // Default background
    res.json({ backgroundUrl });
});

app.post('/game/upload-background', (req, res) => {
    // Handle background upload
});

app.post('/game/set-background', (req, res) => {
    // Handle setting background
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
