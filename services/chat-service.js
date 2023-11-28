const chatQuery = require('../queries/chat-query')
const messageService = require('./message-service')
const tokenService = require('./token-service')

class ChatService {
    async addChat(name, refreshToken, type, model, param, canEdit) {
        const userData = tokenService.validateRefreshToken(refreshToken)
        const createdAt = new Date()
        const response = await chatQuery.set(
            name,
            userData.id,
            type,
            model,
            param,
            createdAt,
            canEdit
        )
        return response.rows[0]
    }

    async getAllChats(refreshToken) {
        const userData = tokenService.validateRefreshToken(refreshToken)
        const response = await chatQuery.findByUid(userData.id)
        return response.rows
    }

    async deleteChat(id) {
        const response = await chatQuery.delete(id)
        await messageService.deleteByChatID(id)
        return response.rows[0]
    }
}

module.exports = new ChatService()
