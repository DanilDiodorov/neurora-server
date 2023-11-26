const walletQuery = require('../queries/wallet-query')

class WalletService {
    async createWallet(uid) {
        const data = await walletQuery.set(uid)

        return data[0]
    }

    async setBalance(uid, balance) {
        const data = await walletQuery.setBalance(uid, balance)

        return data[0]
    }

    async find(uid) {
        const data = await walletQuery.findByUid(uid)

        return data[0]
    }
}

module.exports = new WalletService()
