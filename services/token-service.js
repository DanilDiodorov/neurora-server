const jwt = require('jsonwebtoken')
const tokenQuery = require('../queries/token-query')
const { classToPlain } = require('class-transformer')

class TokenService {
    generateTokens(payload) {
        const plained = classToPlain(payload)
        const accessToken = jwt.sign(plained, process.env.JWT_ACCESS_KEY, {
            expiresIn: '30m',
        })
        const refreshToken = jwt.sign(plained, process.env.JWT_REFRESH_KEY, {
            expiresIn: '30d',
        })

        return {
            accessToken,
            refreshToken,
        }
    }

    async saveToken(uid, refreshToken) {
        const token = await tokenQuery.findByUid(uid)

        const tokenData = token

        if (tokenData.length === 0) {
            await tokenQuery.set(uid, refreshToken)
        } else {
            await tokenQuery.update(uid, refreshToken)
        }
    }

    async removeToken(refreshToken) {
        const token = await tokenQuery.delete(refreshToken)
        return token
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY)
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const token = await tokenQuery.findByRefreshToken(refreshToken)

        return token
    }
}

module.exports = new TokenService()
