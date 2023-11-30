/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    },
    env: {
        SERVER_BACKEND: 'http://192.168.72.81:7000/api',
        FILE_SERVER: 'http://localhost:5500',
        SEARCH_SERVER: 'http://localhost:7300/api',
        VIDEO_SERVER_BACKEND: 'http://192.168.72.81:7500/api',
        LIVE_CHAT_SERVER: 'http://localhost:7000'
    }
}

module.exports = nextConfig
