const { validationResult } = require('express-validator')
const chatService = require('../services/chat-service')
const getCookies = require('../utils/get-cookies')

class ChatController {
    async addChat(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest('Ошибка валидации', errors.array())
                )
            }
            const { refreshToken } = getCookies(req)
            const { name, type, model, param } = req.body
            const response = await chatService.addChat(
                name,
                refreshToken,
                type,
                model,
                param,
                true
            )
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }

    async getAllChats(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            const response = await chatService.getAllChats(refreshToken)
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }

    async deleteChat(req, res, next) {
        try {
            const { id } = req.body
            const response = await chatService.deleteChat(id)
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new ChatController()
