const express = require('express');
const multer = require('multer');
const path = require('path');
const { connectToTikTok, getInteractions } = require('./tiktok-api');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfigurasi multer untuk mengunggah file
const upload = multer({ dest: 'public/images/upload/' });

// Serve static files
app.use(express.static('public'));

// API untuk menghubungkan ke TikTok
app.post('/api/connect-tiktok', upload.single('upload-background'), async (req, res) => {
    const tiktokUsername = req.body['tiktok-username'];
    const defaultBackground = req.body['default-background'];
    const uploadedBackground = req.file;

    try {
        // Menghubungkan ke TikTok API dengan username
        const result = await connectToTikTok(tiktokUsername);

        if (result.success) {
            let backgroundUrl = '';

            if (uploadedBackground) {
                backgroundUrl = `/images/upload/${uploadedBackground.filename}`;
            } else if (defaultBackground) {
                backgroundUrl = `/images/${defaultBackground}`;
            }

            // Simpan URL background ke sesi
            req.session.backgroundUrl = backgroundUrl;

            res.json({
                success: true,
                backgroundUrl
            });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error('Error connecting to TikTok:', error);
        res.status(500).json({ success: false });
    }
});

// API untuk mengatur background
app.post('/api/set-background', async (req, res) => {
    const { backgroundUrl } = req.body;

    if (backgroundUrl) {
        // Simpan URL background ke sesi
        req.session.backgroundUrl = backgroundUrl;
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false });
    }
});

// API untuk mendapatkan data interaksi
app.get('/api/get-interactions', async (req, res) => {
    try {
        const interactions = await getInteractions();
        res.json({
            success: true,
            photos: interactions
        });
    } catch (error) {
        console.error('Error getting interactions:', error);
        res.status(500).json({ success: false });
    }
});

// Halaman Utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Halaman Pengaturan
app.get('/settings.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
