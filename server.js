const express = require('express')
const app = express()
const routes = require('./routes/index')
const cors = require('cors')
const errorHandler = require('./middleware/error-handling-middleware')
const cookieParser = require('cookie-parser')
const socketIO = require('./io')
const socket = require('socket.io')
require('dotenv').config()

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use('/', routes)
app.use(cookieParser())

app.use(errorHandler)

const server = app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})

const io = socket(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
})
io.on('connection', (socket) => {
    socketIO(io, socket)
})
