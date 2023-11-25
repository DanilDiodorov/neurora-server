const aiService = require('../services/ai-service')
const messageService = require('../services/message-service')
const randomstring = require('randomstring')

let current_chats = []

const remove_chat = (chat_id) => {
    current_chats = current_chats.filter((chat) => {
        return chat !== chat_id
    })
}

const socketIO = (io, socket) => {
    socket.on('stop_generate', (data) => {
        remove_chat(data)
    })

    socket.on('message', async (data) => {
        try {
            let now = new Date().toString()
            const mid = randomstring.generate()

            io.emit('sending', {
                chat_id: data.chat_id,
                sending: 'loading',
                mid,
            })

            current_chats.push(data.chat_id)

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
                    if (current_chats.includes(data.chat_id)) {
                        text += part.choices[0]?.delta?.content || ''
                        io.emit('chat message part', {
                            mid,
                            text: part.choices[0]?.delta?.content || '',
                            url: '',
                        })
                    } else {
                        response.controller.abort()
                        break
                    }
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

                remove_chat(data.chat_id)
            } else if (data.chatType === 'image') {
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
        } catch (error) {
            console.log(error)
        }
    })
}

module.exports = socketIO
