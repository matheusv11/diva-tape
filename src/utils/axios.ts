import axios from 'axios'; // DEIXAR AXIOS GLOBAL

const axiosConfig = axios.create({
    // baseURL: process.env.API_URL || 'http://localhost:3030'
    // baseURL: process.env.API_URL || 'http://192.168.1.123:3030'
    baseURL: "https://yt-music-api.vercel.app"
});

export default axiosConfig