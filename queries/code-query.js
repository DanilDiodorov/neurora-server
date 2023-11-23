const query = require('../db')

class CodeQuery {
    async findByUid(uid) {
        const data = await query('SELECT code FROM codes WHERE uid=$1', [uid])
        return data.rows
    }

    async set(uid, code) {
        const data = await query(
            'INSERT INTO codes (uid, code) VALUES ($1, $2)',
            [uid, code]
        )
        return data
    }

    async update(uid, code) {
        const data = await query('UPDATE codes SET code=$2 WHERE uid=$1', [
            uid,
            code,
        ])
        return data
    }

    async delete(uid) {
        const data = await query('DELETE FROM codes WHERE uid=$1', [uid])
        return data
    }
}

module.exports = new CodeQuery()
