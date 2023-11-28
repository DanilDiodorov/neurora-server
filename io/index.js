const initMessage = require('./init-message')
const sendTextMessage = require('./send-text-message')
const sendImageMessage = require('./send-image-message')
const removeChat = require('./current-chats')

const socketIO = (io, socket) => {
    socket.on('stop_generate', (data) => {
        removeChat(data)
    })

    socket.on('message', async (data) => {
        try {
            const { now, mid } = await initMessage(io, data)
            if (data.chatType === 'text') {
                sendTextMessage(io, data, now, mid)
            } else if (data.chatType === 'image') {
                sendImageMessage(io, data)
            }
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = socketIO
