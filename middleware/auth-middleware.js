const ApiError = require('../error/ApiError')
const tokenService = require('../services/token-service')

const getCookies = (req) => {
    let cookies = {}
    const {
        headers: { cookie },
    } = req
    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const data = item.trim().split('=')
            return { ...res, [data[0]]: data[1] }
        }, {})
        cookies = values
    }
    return cookies
}

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const { refreshToken } = getCookies(req)

        if (!refreshToken) {
            next(ApiError.authError())
        }

        const decoded = tokenService.validateRefreshToken(refreshToken)
        req.user = decoded

        next()
    } catch (err) {
        next(ApiError.authError())
    }
}
