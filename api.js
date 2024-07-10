// api.js
const tiktokApiHost = 'your-tiktok-api-host.com'; // Ganti dengan host API TikTok
const tikfinityApiHost = 'your-tikfinity-api-host.com'; // Ganti dengan host API Tikfinity

const tiktokApiToken = 'your-tiktok-api-token'; // Ganti dengan token API TikTok
const tikfinityApiToken = 'your-tikfinity-api-token'; // Ganti dengan token API Tikfinity

// URL untuk menghubungkan WebSocket ke TikTok dan Tikfinity
const tiktokWebSocketUrl = `wss://${tiktokApiHost}/websocket?token=${tiktokApiToken}`;
const tikfinityWebSocketUrl = `wss://${tikfinityApiHost}/websocket?token=${tikfinityApiToken}`;

// Fungsi untuk menghubungkan ke WebSocket TikTok
function connectToTikTokWebSocket() {
    const tiktokSocket = new WebSocket(tiktokWebSocketUrl);

    tiktokSocket.onopen = () => {
        console.log('Connected to TikTok WebSocket server');
    };

    tiktokSocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        // Menggunakan data dari TikTok untuk menambahkan bubble
        if (data.event === 'live_comment') {
            readComment(data.comment);
        } else if (data.event === 'gift') {
            handleGift(data.username, data.coinAmount);
        } else if (data.event === 'user_join') {
            // Mengambil foto profil dari user yang bergabung
            const userProfileUrl = await getUserProfile(data.userId);
            addUserProfileBubble(userProfileUrl, 'small'); // Bubble default ukuran kecil
        }
    };

    tiktokSocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    tiktokSocket.onclose = () => {
        console.log('Disconnected from TikTok WebSocket server');
        // Mencoba untuk reconnect jika WebSocket terputus
        setTimeout(connectToTikTokWebSocket, 5000);
    };
}

// Fungsi untuk menghubungkan ke WebSocket Tikfinity
function connectToTikfinityWebSocket() {
    const tikfinitySocket = new WebSocket(tikfinityWebSocketUrl);

    tikfinitySocket.onopen = () => {
        console.log('Connected to Tikfinity WebSocket server');
    };

    tikfinitySocket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        // Menggunakan data dari Tikfinity untuk menambahkan bubble
        if (data.event === 'live_comment') {
            readComment(data.comment);
        } else if (data.event === 'gift') {
            handleGift(data.username, data.coinAmount);
        } else if (data.event === 'user_join') {
            // Mengambil foto profil dari user yang bergabung
            const userProfileUrl = await getUserProfile(data.userId);
            addUserProfileBubble(userProfileUrl, 'small'); // Bubble default ukuran kecil
        }
    };

    tikfinitySocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    tikfinitySocket.onclose = () => {
        console.log('Disconnected from Tikfinity WebSocket server');
        // Mencoba untuk reconnect jika WebSocket terputus
        setTimeout(connectToTikfinityWebSocket, 5000);
    };
}

// Mengambil foto profil user berdasarkan userId
async function getUserProfile(userId) {
    try {
        const response = await fetch(`https://${tiktokApiHost}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tiktokApiToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data.profile_picture_url; // Ganti dengan path ke foto profil sesuai API
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return 'default-profile-pic.jpg'; // Ganti dengan URL gambar default jika gagal
    }
}

// Menyambungkan ke WebSocket TikTok dan Tikfinity
connectToTikTokWebSocket();
connectToTikfinityWebSocket();

export { tiktokWebSocketUrl, tikfinityWebSocketUrl, addUserProfileBubble };
