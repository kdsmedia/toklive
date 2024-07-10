// api.js

// Konfigurasi API TikTok
const tiktokConfig = {
    apiUrl: 'https://api.tiktok.com', // URL dasar untuk TikTok API
    accessToken: process.env.TIKTOK_ACCESS_TOKEN, // Token akses TikTok
    clientKey: process.env.TIKTOK_CLIENT_KEY, // Kunci klien TikTok
    clientSecret: process.env.TIKTOK_CLIENT_SECRET, // Rahasia klien TikTok
    apiVersion: 'v1' // Versi API TikTok
};

// Konfigurasi API Tikfinity
const tikfinityConfig = {
    apiUrl: 'https://api.tikfinity.com', // URL dasar untuk Tikfinity API
    apiKey: process.env.TIKFINITY_API_KEY, // Kunci API Tikfinity
    apiSecret: process.env.TIKFINITY_API_SECRET, // Rahasia API Tikfinity
    apiVersion: 'v1' // Versi API Tikfinity
};

// Mengambil data dari TikTok API
const getTikTokData = async (endpoint, params = {}) => {
    try {
        const response = await fetch(`${tiktokConfig.apiUrl}/${tiktokConfig.apiVersion}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tiktokConfig.accessToken}`,
                'Content-Type': 'application/json'
            },
            params: params
        });

        if (!response.ok) {
            throw new Error(`TikTok API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data from TikTok:', error);
    }
};

// Mengirim data ke TikTok API
const postTikTokData = async (endpoint, data = {}) => {
    try {
        const response = await fetch(`${tiktokConfig.apiUrl}/${tiktokConfig.apiVersion}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tiktokConfig.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`TikTok API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting data to TikTok:', error);
    }
};

// Mengambil data dari Tikfinity API
const getTikfinityData = async (endpoint, params = {}) => {
    try {
        const response = await fetch(`${tikfinityConfig.apiUrl}/${tikfinityConfig.apiVersion}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tikfinityConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            params: params
        });

        if (!response.ok) {
            throw new Error(`Tikfinity API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data from Tikfinity:', error);
    }
};

// Mengirim data ke Tikfinity API
const postTikfinityData = async (endpoint, data = {}) => {
    try {
        const response = await fetch(`${tikfinityConfig.apiUrl}/${tikfinityConfig.apiVersion}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tikfinityConfig.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Tikfinity API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting data to Tikfinity:', error);
    }
};

// Ekspor fungsi API
module.exports = {
    getTikTokData,
    postTikTokData,
    getTikfinityData,
    postTikfinityData
};
