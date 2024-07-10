// server.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Konfigurasi API dan WebSocket
const tiktokApiHost = 'your-tiktok-api-host.com'; // Ganti dengan host API TikTok
const tikfinityApiHost = 'your-tikfinity-api-host.com'; // Ganti dengan host API Tikfinity
const tiktokApiToken = 'your-tiktok-api-token'; // Ganti dengan token API TikTok
const tikfinityApiToken = 'your-tikfinity-api-token'; // Ganti dengan token API Tikfinity

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware untuk meng-host file statis
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/settings', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

// Handle WebSocket connections untuk TikTok dan Tikfinity
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Fungsi untuk menangani pesan yang diterima dari client
    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

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
            console.error('Error handling WebSocket message:', error);
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

    // Simulasi WebSocket untuk TikTok dan Tikfinity
    simulateTikTokWebSocket(ws);
    simulateTikfinityWebSocket(ws);
});

// Fungsi untuk mensimulasikan WebSocket TikTok
function simulateTikTokWebSocket(ws) {
    // Simulasi data TikTok
    setInterval(() => {
        const randomEvent = Math.random() > 0.5 ? 'gift' : 'user_join';
        const data = randomEvent === 'gift'
            ? {
                event: 'gift',
                username: `User${Math.floor(Math.random() * 100)}`,
                coinAmount: Math.floor(Math.random() * 2000) + 1
            }
            : {
                event: 'user_join',
                userId: `user${Math.floor(Math.random() * 1000)}`,
                username: `User${Math.floor(Math.random() * 100)}`
            };
        ws.send(JSON.stringify(data));
    }, 3000); // Kirim data setiap 3 detik
}

// Fungsi untuk mensimulasikan WebSocket Tikfinity
function simulateTikfinityWebSocket(ws) {
    // Simulasi data Tikfinity
    setInterval(() => {
        const randomEvent = Math.random() > 0.5 ? 'gift' : 'user_join';
        const data = randomEvent === 'gift'
            ? {
                event: 'gift',
                username: `User${Math.floor(Math.random() * 100)}`,
                coinAmount: Math.floor(Math.random() * 2000) + 1
            }
            : {
                event: 'user_join',
                userId: `user${Math.floor(Math.random() * 1000)}`,
                username: `User${Math.floor(Math.random() * 100)}`
            };
        ws.send(JSON.stringify(data));
    }, 3000); // Kirim data setiap 3 detik
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
