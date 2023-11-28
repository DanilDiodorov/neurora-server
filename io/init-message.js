const messageService = require('../services/message-service')
const randomstring = require('randomstring')

require('./current-chats.js')

const initMessage = async (io, data) => {
    const now = new Date().toString()
    const mid = randomstring.generate()

    io.emit('sending', {
        chat_id: data.chat_id,
        sending: 'loading',
        mid,
    })

    global.currentChats.push(data.chat_id)

    io.emit('chat message', {
        mid,
        chat_id: data.chat_id,
        text: '',
        is_my: false,
        type: data.chatType,
        url: '',
        created_at: now,
        loading: true,
    })

    await messageService.addMessage(
        data.chat_id,
        data.type,
        data.text,
        data.url,
        now,
        data.is_my
    )

    return { now, mid }
}

module.exports = initMessage
