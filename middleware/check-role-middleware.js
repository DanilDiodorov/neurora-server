const ApiError = require('../error/ApiError')
const tokenService = require('../services/token-service')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                next(ApiError.authError())
            }

            const decoded = tokenService.validateAccessToken(token)

            if (decoded.role !== role) {
                next(ApiError.forbidden())
            }

            req.user = decoded

            next()
        } catch (err) {
            next(ApiError.authError())
        }
    }
}
