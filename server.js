// server.js

const express = require('express'); // Import express framework
const http = require('http'); // Import modul http
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const WebSocket = require('ws'); // Import modul WebSocket
const path = require('path'); // Import modul path untuk path file
const axios = require('axios'); // Import axios untuk melakukan request API

require('dotenv').config(); // Memuat variabel lingkungan dari .env

const tiktokApiHost = process.env.TIKTOK_API_HOST;
const tikfinityApiHost = process.env.TIKFINITY_API_HOST;
const tiktokApiToken = process.env.TIKTOK_API_TOKEN;
const tikfinityApiToken = process.env.TIKFINITY_API_TOKEN;

const app = express(); // Inisialisasi aplikasi Express
const server = http.createServer(app); // Membuat server HTTP
const wss = new WebSocket.Server({ server }); // Membuat WebSocket Server

// Konfigurasi Multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images/upload')); // Folder penyimpanan gambar upload
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}${ext}`;
        cb(null, filename); // Nama file yang unik berdasarkan timestamp
    }
});
const upload = multer({ storage });

// Middleware untuk meng-host file statis
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Menyediakan akses ke file statis di folder public

app.use(express.static(path.join(__dirname, 'public'))); // Menyajikan file dari direktori 'public'

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Menyajikan file 'index.html'
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html')); // Menyajikan file 'settings.html'
});

// Handle WebSocket connections untuk TikTok dan Tikfinity
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Fungsi untuk menangani pesan yang diterima dari client
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message); // Parse pesan JSON

            // Mengirim data gift dan user join ke client
            if (data.event === 'gift') {
                ws.send(JSON.stringify({
                    event: 'gift',
                    username: data.username,
                    coinAmount: data.coinAmount
                }));
            } else if (data.event === 'user_join') {
                ws.send(JSON.stringify({
                    event: 'user_join',
                    userId: data.userId,
                    username: data.username
                }));
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error); // Tangani error
        }
    });

    // Fungsi untuk menangani penutupan koneksi WebSocket
    ws.on('close', () => {
        console.log('WebSocket connection closed.');
    });

    // Fungsi untuk menangani kesalahan WebSocket
    ws.on('error', (error) => {
        console.error('WebSocket Error:', error);
    });

    // Mensimulasikan WebSocket untuk TikTok dan Tikfinity
    simulateTikTokWebSocket();
    simulateTikfinityWebSocket();
});

// Fungsi untuk mensimulasikan WebSocket TikTok
function simulateTikTokWebSocket() {
    // Mengambil data TikTok dari API
    setInterval(async () => {
        try {
            const response = await axios.get(`${tiktokApiHost}/events`, {
                headers: { 'Authorization': `Bearer ${tiktokApiToken}` }
            });

            // Kirim data gift atau user join ke client
            const events = response.data; // Asumsi response.data berisi array data event

            events.forEach(event => {
                if (event.type === 'gift') {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                event: 'gift',
                                username: event.username,
                                coinAmount: event.coinAmount
                            }));
                        }
                    });
                } else if (event.type === 'user_join') {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                event: 'user_join',
                                userId: event.userId,
                                username: event.username
                            }));
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching TikTok data:', error); // Tangani error
        }
    }, 3000); // Ambil data setiap 3 detik
}

// Fungsi untuk mensimulasikan WebSocket Tikfinity
function simulateTikfinityWebSocket() {
    // Mengambil data Tikfinity dari API
    setInterval(async () => {
        try {
            const response = await axios.get(`${tikfinityApiHost}/events`, {
                headers: { 'Authorization': `Bearer ${tikfinityApiToken}` }
            });

            // Kirim data gift atau user join ke client
            const events = response.data; // Asumsi response.data berisi array data event

            events.forEach(event => {
                if (event.type === 'gift') {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                event: 'gift',
                                username: event.username,
                                coinAmount: event.coinAmount
                            }));
                        }
                    });
                } else if (event.type === 'user_join') {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                event: 'user_join',
                                userId: event.userId,
                                username: event.username
                            }));
                        }
                    });
                }
            });
        } catch (error) {
            console.error('Error fetching Tikfinity data:', error); // Tangani error
        }
    }, 3000); // Ambil data setiap 3 detik
}

// Endpoint untuk menghubungkan TikTok
app.post('/api/connect-tiktok', upload.single('upload-background'), (req, res) => {
    const tiktokUsername = req.body['tiktok-username'];
    const backgroundFile = req.file;
    const defaultBackground = req.body['default-background'];

    if (!tiktokUsername) {
        return res.status(400).json({ success: false, message: 'Username TikTok tidak tersedia.' });
    }

    // Simulasikan penyimpanan data
    console.log(`Username TikTok: ${tiktokUsername}`);
    if (backgroundFile) {
        console.log(`Gambar Background di-upload: ${backgroundFile.filename}`);
    }
    if (defaultBackground) {
        console.log(`Background Default Dipilih: ${defaultBackground}`);
    }

    res.json({ success: true, message: 'Berhasil terhubung dengan TikTok!' });
});

// Endpoint untuk mengatur background default
app.post('/api/set-background', (req, res) => {
    const { backgroundUrl } = req.body;

    if (backgroundUrl) {
        // Simulasikan pengaturan background
        console.log(`Mengatur background ke: ${backgroundUrl}`);
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'URL background tidak tersedia.' });
    }
});

// Endpoint untuk mengambil background default
app.get('/api/backgrounds', (req, res) => {
    const backgroundsDir = path.join(__dirname, 'public/images');
    fs.readdir(backgroundsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Gagal membaca folder background.' });
        }

        const backgroundImages = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
        res.json({ success: true, backgrounds: backgroundImages });
    });
});

// Endpoint untuk mengunduh gambar background
app.get('/images/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'public/images', req.params.filename);
    res.sendFile(filePath);
});

// Mulai server
const PORT = process.env.PORT || 3000; // Ambil PORT dari variabel lingkungan atau default ke 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log pesan saat server dimulai
});
