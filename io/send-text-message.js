const walletService = require('../services/wallet-service')
const aiService = require('../services/ai-service')
const messageService = require('../services/message-service')
const { encode, encodeChat } = require('gpt-tokenizer')
const removeChat = require('./current-chats')
const costService = require('../services/cost-service.js')
require('./current-chats.js')

const sendTextMessage = async (io, data, now, mid) => {
    const messages = await messageService.findByChatID(data.chat_id)
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

    const balanceQuery = await walletService.find(data.uid)
    const costQuery = await costService.findByModel(data.chatModel)
    let balance = balanceQuery.balance
    const inputCost = costQuery.input_cost
    const outputCost = costQuery.output_cost
    const maxTokens = costQuery.max_token

    let text = ''

    while (true) {
        if (encodeChat(filtredMessages, 'gpt-3.5-turbo').length > maxTokens) {
            filtredMessages.shift()
        } else {
            break
        }
    }

    balance -=
        encodeChat(filtredMessages, 'gpt-3.5-turbo').length * (inputCost / 1000)

    io.emit('chat message part', {
        balance,
        mid,
        text: '',
        url: '',
    })

    for await (const part of response) {
        if (global.currentChats.includes(data.chat_id) && balance > 0) {
            let temp = part.choices[0]?.delta?.content || ''
            balance -= encode(temp).length * (outputCost / 1000)
            text += temp
            io.emit('chat message part', {
                balance,
                mid,
                text: temp,
                url: '',
            })
        } else {
            response.controller.abort()
            break
        }
    }

    await messageService.addMessage(data.chat_id, 'text', text, '', now, false)

    await walletService.setBalance(data.uid, balance)

    removeChat(data.chat_id)

    io.emit('sending', {
        chat_id: data.chat_id,
        sending: 'end',
        mid,
    })
}

module.exports = sendTextMessage
