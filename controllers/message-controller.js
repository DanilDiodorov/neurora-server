const messageService = require('../services/message-service')

class MessageController {
    async findByChatID(req, res, next) {
        const { id } = req.body
        const response = await messageService.findByChatID(id, 30)
        return res.json(response.reverse())
    }

    async deleteByChatID(req, res, next) {
        const { id } = req.body
        await messageService.deleteByChatID(id)
        return res.json({})
    }
}

module.exports = new MessageController()
