require('dotenv').config()
const http = require('http')
const app = require('./src/app')

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('server running on post http://localhost:3000')
})

const shutdown = () => {
    console.log('Shutting down server.')
    server.close(() => {
        console.log('server closed')
        process.exit(0)
    })
}

process.on('SIGINT', shutdown)
process.on("SIGTERM", shutdown)