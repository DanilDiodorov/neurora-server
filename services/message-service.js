const messageQuery = require('../queries/message-query')

class MessageSevice {
    async addMessage(chatID, type, text, url, createdAt, isMy) {
        await messageQuery.set(chatID, type, text, url, createdAt, isMy)
    }

    async findByChatID(chatID, limit = null) {
        const response = await messageQuery.findByChatID(chatID, limit)
        return response
    }

    async deleteByChatID(chatID) {
        await messageQuery.deleteByChatID(chatID)
    }
}

module.exports = new MessageSevice()
