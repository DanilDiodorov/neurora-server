const query = require('../db')

class TokenQuery {
    async findByUid(uid) {
        const data = await query('SELECT * FROM tokens WHERE uid=$1', [uid])

        return data.rows
    }

    async set(uid, refreshToken) {
        await query('INSERT INTO tokens (uid, refreshtoken)  VALUES ($1, $2)', [
            uid,
            refreshToken,
        ])
    }

    async update(uid, refreshToken) {
        await query('UPDATE tokens SET refreshtoken=$2 WHERE uid=$1', [
            uid,
            refreshToken,
        ])
    }

    async delete(refreshToken) {
        const data = await query(
            `DELETE FROM tokens WHERE refreshtoken='${refreshToken}'`
        )
        return data
    }

    async findByRefreshToken(refreshToken) {
        const data = await query(
            `SELECT * FROM tokens WHERE refreshtoken='${refreshToken}'`
        )
        return data.rows
    }
}

module.exports = new TokenQuery()
