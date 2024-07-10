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

// Fungsi untuk mendapatkan data interaksi dari TikTok API
async function getInteractions() {
    try {
        // Ganti dengan URL TikTok API untuk mendapatkan interaksi
        const response = await fetch('https://api.tiktok.com/interactions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.TIKTOK_API_KEY}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            // Format data untuk menampilkan foto profil dan nominal koin
            const interactions = data.map(interaction => ({
                userId: interaction.userId,
                photoUrl: interaction.userPhotoUrl,
                coins: interaction.coins
            }));
            return interactions;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching interactions:', error);
        return [];
    }
}

module.exports = { connectToTikTok, getInteractions };
