const ApiError = require('../error/ApiError')
const userService = require('../services/user-service')
const { validationResult } = require('express-validator')
const getCookies = require('../utils/get-cookies')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest('Ошибка валидации', errors.array())
                )
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: true,
                sameSite: 'none',
            }).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            res.setHeader('Set-Cookie', ['foo=bar', 'bar=baz'])
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: true,
                sameSite: 'none',
            }).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken').json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false,
                secure: true,
                sameSite: 'none',
            }).json(userData)
        } catch (e) {
            next(e)
        }
    }

    async checkCode(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            const { code } = req.body

            await userService.checkCode(refreshToken, code)
            return res.json({}).status(200)
        } catch (e) {
            next(e)
        }
    }

    async resendCode(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            await userService.resendCode(refreshToken)
            return res.json({}).status(200)
        } catch (e) {
            next(e)
        }
    }

    async changeEmail(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest('Ошибка валидации', errors.array())
                )
            }
            const { refreshToken } = getCookies(req)
            const { newEmail } = req.body
            await userService.changeEmail(refreshToken, newEmail)
            return res.json({}).status(200)
        } catch (e) {
            next(e)
        }
    }

    async newPassword(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.badRequest('Ошибка валидации', errors.array())
                )
            }
            const { email } = req.body
            await userService.newPassword(email)
            return res.json({}).status(200)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()
