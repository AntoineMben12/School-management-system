import 'dotenv/config.js'
import http from 'http'
import app from './src/app.js'

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

const server = http.createServer(app);

server.listen(PORT, HOST, () => {
    console.log(`✅ Server running on http://${HOST}:${PORT}`)
    console.log(`📝 Node Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔒 JWT Secret configured: ${process.env.JWT_SECRET ? 'Yes' : 'No (⚠️ Configure in .env)'}`)
})

const shutdown = () => {
    console.log('📴 Shutting down server.')
    server.close(() => {
        console.log('✅ Server closed')
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on("SIGTERM", shutdown)

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error)
    process.exit(1)
})