const UserDto = require('../dtos/user-dto')
const ApiError = require('../error/ApiError')
const tokenService = require('./token-service')
const userQuery = require('../queries/user-query')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service')
const codeService = require('./code-service')
const randomstring = require('randomstring')
const chatService = require('./chat-service')

class UserService {
    async registration(email, password) {
        const candidate = await userQuery.findByEmail(email)

        if (candidate.length > 0) {
            throw ApiError.badRequest(
                'Пользователь с таким E-mail уже существует'
            )
        }

        const createdAt = new Date()
        const hashPassword = await bcrypt.hash(password, 5)
        const verified = false
        const tokens = 1000
        const role = 'free-user'

        await userQuery.set(
            email,
            hashPassword,
            tokens,
            role,
            verified,
            createdAt
        )

        const userData = await userQuery.findByEmail(email)

        const user = userData[0]
        const userDto = new UserDto(user)
        const jwtTokens = tokenService.generateTokens(userDto)

        await tokenService.saveToken(userDto.id, jwtTokens.refreshToken)

        const code = await codeService.generateCode(userDto.id)

        await chatService.addChat(
            'Neurora GPT',
            jwtTokens.refreshToken,
            'text',
            'gpt-3.5-turbo',
            '',
            false
        )

        await mailService.sendActivationMail(email, code)

        return {
            ...jwtTokens,
            user: userDto,
        }
    }

    async login(email, password) {
        const user = await userQuery.findByEmail(email)

        if (user.length === 0) {
            throw ApiError.badRequest('Ползователь не найден')
        }

        const comparePassword = bcrypt.compareSync(password, user[0].password)

        if (!comparePassword) {
            throw ApiError.badRequest('Ползователь не найден')
        }

        const userDto = new UserDto(user[0])
        const jwtTokens = tokenService.generateTokens(userDto)

        await tokenService.saveToken(userDto.id, jwtTokens.refreshToken)

        return {
            ...jwtTokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)

        return token
    }

    async refresh(refreshToken) {
        const candidate = tokenService.validateRefreshToken(refreshToken)

        const tokenFromDB = await tokenService.findToken(refreshToken)

        if (!candidate || tokenFromDB.length === 0) {
            throw ApiError.authError()
        }

        const userData = await userQuery.findByEmail(candidate.email)

        const user = userData[0]
        const userDto = new UserDto(user)
        const jwtTokens = tokenService.generateTokens(userDto)

        await tokenService.saveToken(userDto.id, jwtTokens.refreshToken)

        return {
            ...jwtTokens,
            user: userDto,
        }
    }

    async checkCode(refreshToken, code) {
        const user = tokenService.validateRefreshToken(refreshToken)

        const realCode = await codeService.find(user.id)

        if (realCode === null) {
            throw ApiError.badRequest('Ошибка, попробуйте еще раз')
        }

        if (realCode !== code) {
            throw ApiError.badRequest('Неверный код')
        }

        await codeService.deleteCode(user.id)
        await userQuery.updateVerified(user.id)

        return true
    }

    async resendCode(refreshToken) {
        const user = tokenService.validateRefreshToken(refreshToken)

        const code = await codeService.generateCode(user.id)

        await mailService.sendActivationMail(user.email, code)

        return true
    }

    async changeEmail(refreshToken, newEmail) {
        const candidate = await userQuery.findByEmail(newEmail)

        if (candidate.length > 0) {
            throw ApiError.badRequest(
                'Пользователь с таким E-mail уже существует'
            )
        }

        const user = tokenService.validateRefreshToken(refreshToken)

        const code = await codeService.generateCode(user.id)

        await userQuery.updateEmail(user.id, newEmail)

        await mailService.sendActivationMail(newEmail, code)

        return true
    }

    async newPassword(email) {
        const candidate = await userQuery.findByEmail(email)

        if (candidate.length === 0) {
            throw ApiError.badRequest('Пользователь не найден')
        }
        const { id } = candidate[0]

        const password = randomstring.generate(10)
        const hashPassword = await bcrypt.hash(password, 5)

        await userQuery.updatePassword(id, hashPassword)

        await mailService.sendNewPassword(email, password)

        return true
    }
}

module.exports = new UserService()
