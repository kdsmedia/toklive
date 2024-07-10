// server.js
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 8081;
const API_BASE_URL = process.env.API_BASE_URL;
const CLIENT_KEY = process.env.CLIENT_KEY;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Halaman Utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Halaman Pengaturan
app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Endpoint untuk mengarahkan pengguna ke halaman otorisasi TikTok
app.get('/tiktok/auth', (req, res) => {
    const authUrl = `https://www.tiktok.com/oauth/authorize/?client_key=${CLIENT_KEY}&response_type=code&scope=user.info.basic,video.list&redirect_uri=${REDIRECT_URI}&state=YOUR_RANDOM_STATE`;
    res.redirect(authUrl);
});

// Callback dari TikTok setelah otorisasi
app.get('/tiktok/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.send('Kode otorisasi tidak ditemukan.');
    }

    try {
        const response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
            client_key: CLIENT_KEY,
            client_secret: CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI
        });
        const { access_token, open_id } = response.data.data;
        // Simpan token di tempat yang aman, misalnya dalam memori atau database
        res.send(`Token Akses: ${access_token}<br>Open ID: ${open_id}`);
    } catch (error) {
        console.error('Error mendapatkan token akses:', error);
        res.send('Gagal mendapatkan token akses.');
    }
});

// Mengambil background dari server
app.get('/current-background', (req, res) => {
    // Simpan URL background default
    res.json({ backgroundUrl: '/images/default.jpg' });
});

// Mengunggah background baru
app.post('/game/upload-background', (req, res) => {
    // Simpan background yang diunggah oleh pengguna
    res.json({ backgroundUrl: '/images/upload/your_uploaded_image.jpg' });
});

// Mengatur background default
app.post('/game/set-background', (req, res) => {
    // Atur background default yang dipilih oleh pengguna
    res.json({ backgroundUrl: '/images/default-background.jpg' });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
