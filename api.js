// api.js

// Konfigurasi API TikTok dan Tikfinity
const tiktokWebSocketUrl = 'wss://your-tiktok-websocket-url';  // Ganti dengan URL WebSocket TikTok
const tikfinityWebSocketUrl = 'wss://your-tikfinity-websocket-url'; // Ganti dengan URL WebSocket Tikfinity

const tiktokApiHost = 'https://your-tiktok-api-host.com';  // Ganti dengan host API TikTok
const tikfinityApiHost = 'https://your-tikfinity-api-host.com'; // Ganti dengan host API Tikfinity

const tiktokApiToken = 'your-tiktok-api-token'; // Ganti dengan token API TikTok
const tikfinityApiToken = 'your-tikfinity-api-token'; // Ganti dengan token API Tikfinity

// Function untuk mendapatkan data dari API TikTok
async function fetchTikTokData(endpoint, params = {}) {
    const url = new URL(endpoint, tiktokApiHost);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tiktokApiToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`TikTok API Error: ${response.statusText}`);
    }

    return await response.json();
}

// Function untuk mendapatkan data dari API Tikfinity
async function fetchTikfinityData(endpoint, params = {}) {
    const url = new URL(endpoint, tikfinityApiHost);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tikfinityApiToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Tikfinity API Error: ${response.statusText}`);
    }

    return await response.json();
}

// Function untuk menghubungkan ke WebSocket TikTok dan Tikfinity
function connectToWebSocket(url, onMessage) {
    const socket = new WebSocket(url);

    socket.addEventListener('open', () => {
        console.log(`Connected to WebSocket: ${url}`);
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    });

    socket.addEventListener('error', (error) => {
        console.error(`WebSocket Error: ${error.message}`);
    });

    socket.addEventListener('close', () => {
        console.log(`Disconnected from WebSocket: ${url}`);
    });

    return socket;
}

// Function untuk menghubungkan ke WebSocket TikTok
function connectToTikTokWebSocket() {
    return connectToWebSocket(tiktokWebSocketUrl, (data) => {
        if (data.event === 'gift') {
            const sizeClass = getSizeClass(data.coinAmount);
            const userProfileUrl = getUserProfileFromCache(data.username);
            addUserProfileBubble(userProfileUrl, sizeClass);
        }
    });
}

// Function untuk menghubungkan ke WebSocket Tikfinity
function connectToTikfinityWebSocket() {
    return connectToWebSocket(tikfinityWebSocketUrl, (data) => {
        if (data.event === 'gift') {
            const sizeClass = getSizeClass(data.coinAmount);
            const userProfileUrl = getUserProfileFromCache(data.username);
            addUserProfileBubble(userProfileUrl, sizeClass);
        }
    });
}

// Mendapatkan kelas ukuran bubble berdasarkan jumlah gift
function getSizeClass(coinAmount) {
    if (coinAmount >= 1000) return 'extra-large';
    if (coinAmount >= 500) return 'large';
    if (coinAmount >= 100) return 'medium';
    return 'small';
}

// Mendapatkan URL foto profil pengguna dari cache atau API
function getUserProfileFromCache(username) {
    // Di sini Anda bisa menggunakan cache atau API untuk mendapatkan foto profil pengguna
    return `https://example.com/profile-pic/${username}`;  // Ganti dengan URL API yang sesuai
}

// Fungsi untuk menambahkan foto profil user ke dalam bubble
function addUserProfileBubble(userProfileUrl, sizeClass) {
    const interactionPhotos = document.getElementById('interaction-photos');
    const bubble = document.createElement('div');
    bubble.className = `bubble ${sizeClass}`;
    const img = document.createElement('img');
    img.src = userProfileUrl;
    bubble.appendChild(img);
    interactionPhotos.appendChild(bubble);

    // Randomize posisi bubble
    bubble.style.top = `${Math.random() * 100}%`;
    bubble.style.left = `${Math.random() * 100}%`;

    // Menghapus bubble setelah beberapa detik
    setTimeout(() => {
        bubble.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => {
            interactionPhotos.removeChild(bubble);
        }, 1000);
    }, 5000);
}

// Ekspor fungsi dan konfigurasi API
export {
    tiktokWebSocketUrl,
    tikfinityWebSocketUrl,
    tiktokApiHost,
    tikfinityApiHost,
    tiktokApiToken,
    tikfinityApiToken,
    fetchTikTokData,
    fetchTikfinityData,
    connectToTikTokWebSocket,
    connectToTikfinityWebSocket,
    getSizeClass,
    getUserProfileFromCache,
    addUserProfileBubble
};
