const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup multer untuk upload file
const upload = multer({ dest: 'public/images/upload/' });

// Rute untuk mengarahkan ke halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rute untuk mengarahkan ke halaman pengaturan
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Endpoint untuk mendapatkan background saat ini
app.get('/current-background', (req, res) => {
    res.json({ backgroundUrl: '/images/default.jpg' }); // Ubah jika menggunakan background dinamis
});

// Endpoint untuk mengunggah background
app.post('/game/upload-background', upload.single('upload-background'), (req, res) => {
    const { 'tiktok-username': tiktokUsername, 'default-background': defaultBackground } = req.body;
    const uploadedImage = req.file ? req.file.filename : '';
    let backgroundUrl = '/images/default.jpg';

    if (uploadedImage) {
        backgroundUrl = `/images/upload/${uploadedImage}`;
    } else if (defaultBackground) {
        backgroundUrl = `/images/${defaultBackground}`;
    }

    res.json({ backgroundUrl });
});

// Endpoint untuk mengatur background
app.post('/game/set-background', (req, res) => {
    const { backgroundUrl } = req.body;
    if (backgroundUrl) {
        res.json({ backgroundUrl });
    } else {
        res.status(400).json({ error: 'Background URL tidak valid.' });
    }
});

// Mulai server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
