const fetch = require('node-fetch');

// Fungsi untuk menghubungkan ke TikTok API
async function connectToTikTok(username) {
    try {
        // Ganti dengan URL TikTok API yang sesuai
        const response = await fetch(`https://api.tiktok.com/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.TIKTOK_API_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Lakukan sesuatu dengan data TikTok, misalnya simpan sesi atau info lainnya
            return { success: true, data };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.error('Error connecting to TikTok:', error);
        return { success: false };
    }
}

module.exports = { connectToTikTok };
