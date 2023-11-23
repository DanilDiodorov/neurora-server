const aiService = require('../services/ai-service')
const messageService = require('../services/message-service')
const randomstring = require('randomstring')

const socketIO = (io, socket) => {
    socket.on('message', async (data) => {
        try {
            let now = new Date().toString()
            const mid = randomstring.generate()

            io.emit('sending', {
                chat_id: data.chat_id,
                sending: 'loading',
                mid,
            })

            io.emit('chat message', {
                mid,
                chat_id: data.chat_id,
                text: '',
                ismy: false,
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
                data.ismy
            )

            if (data.chatType === 'text') {
                const messages = await messageService.findByChatID(
                    data.chat_id,
                    10
                )
                const filtredMessages = messages
                    .map((message) => {
                        return {
                            role: message.ismy ? 'user' : 'assistant',
                            content: message.text,
                        }
                    })
                    .reverse()
                const response = await aiService.generateResponseStream(
                    filtredMessages,
                    data.chatModel
                )

                io.emit('sending', {
                    chat_id: data.chat_id,
                    sending: 'start',
                    mid,
                })

                let text = ''

                for await (const part of response) {
                    text += part.choices[0]?.delta?.content || ''
                    io.emit('chat message part', {
                        mid,
                        text: part.choices[0]?.delta?.content || '',
                        url: '',
                    })
                }

                io.emit('sending', {
                    chat_id: data.chat_id,
                    sending: 'end',
                    mid,
                })

                await messageService.addMessage(
                    data.chat_id,
                    'text',
                    text,
                    '',
                    now,
                    false
                )
            } else if (data.chatType === 'image') {
                const response = await aiService.generateImage(data.text)

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
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = socketIO
