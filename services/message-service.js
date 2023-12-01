const messageQuery = require('../queries/message-query')

class MessageSevice {
    async addMessage(chatID, type, text, url, createdAt, isMy) {
        await messageQuery.set(chatID, type, text, url, createdAt, isMy)
    }

    async findByChatID(chatID, offset = null, limit = null) {
        const response = await messageQuery.findByChatID(chatID, offset, limit)
        return response
    }

    async deleteByChatID(chatID) {
        await messageQuery.deleteByChatID(chatID)
    }
}

module.exports = new MessageSevice()
