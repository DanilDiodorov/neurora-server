const query = require('../db')

class WalletQuery {
    async set(uid) {
        const data = await query(
            'INSERT INTO wallet (uid) VALUES ($1) RETURNING *',
            [uid]
        )
        return data.rows
    }

    async setBalance(uid, balance) {
        const data = await query(
            'UPDATE wallet SET balance=$2 WHERE uid=$1 RETURNING *',
            [uid, balance]
        )
        return data.rows
    }

    async findByUid(uid) {
        const data = await query('SELECT * FROM wallet WHERE uid=$1', [uid])
        return data.rows
    }
}

module.exports = new WalletQuery()
