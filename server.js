// server.js

const express = require('express'); // Import express framework
const http = require('http'); // Import modul http
const WebSocket = require('ws'); // Import modul WebSocket
const path = require('path'); // Import modul path untuk path file
const axios = require('axios'); // Import axios untuk melakukan request API

// Konfigurasi API dan WebSocket
const tiktokApiHost = 'your-tiktok-api-host.com'; // Ganti dengan host API TikTok
const tikfinityApiHost = 'your-tikfinity-api-host.com'; // Ganti dengan host API Tikfinity
const tiktokApiToken = 'your-tiktok-api-token'; // Ganti dengan token API TikTok
const tikfinityApiToken = 'your-tikfinity-api-token'; // Ganti dengan token API Tikfinity

const app = express(); // Inisialisasi aplikasi Express
const server = http.createServer(app); // Membuat server HTTP
const wss = new WebSocket.Server({ server }); // Membuat WebSocket Server

// Middleware untuk meng-host file statis
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

// Mulai server
const PORT = process.env.PORT || 3000; // Ambil PORT dari variabel lingkungan atau default ke 3000
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log pesan saat server dimulai
});
