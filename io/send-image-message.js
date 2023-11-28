const aiService = require('../services/ai-service')

const sendImageMessage = async (io, data) => {
    const response = await aiService.generateImage(data.text)

    console.log(response)
    io.emit('sending', {
        chat_id: data.chat_id,
        sending: 'start',
        mid,
    })

    io.emit('chat message part', {
        mid,
        text: '',
        url: response,
    })

    io.emit('sending', {
        chat_id: data.chat_id,
        sending: 'end',
        mid,
    })

    await messageService.addMessage(
        data.chat_id,
        'image',
        '',
        response,
        now,
        false
    )
}

module.exports = sendImageMessage
