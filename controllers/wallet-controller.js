const tokenService = require('../services/token-service')
const walletService = require('../services/wallet-service')
const getCookies = require('../utils/get-cookies')

class WalletConroller {
    async find(req, res, next) {
        try {
            const { refreshToken } = getCookies(req)
            const user = tokenService.validateRefreshToken(refreshToken)
            const data = await walletService.find(user.id)
            return res.json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new WalletConroller()
