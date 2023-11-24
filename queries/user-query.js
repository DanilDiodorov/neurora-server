const query = require('../db')

class UserQuery {
    async findByEmail(email) {
        const data = await query('SELECT * FROM users WHERE email=$1', [email])

        return data.rows
    }

    async set(email, hashPassword, tokens, role, verified, createdAt) {
        await query(
            'INSERT INTO users (email, password, role, verified, created_at) VALUES($1, $2, $3, $4, $5)',
            [email, hashPassword, role, verified, createdAt]
        )
    }

    async updateVerified(uid) {
        await query('UPDATE users SET verified=true WHERE id=$1', [uid])
    }

    async updateEmail(uid, newEmail) {
        await query('UPDATE users SET email=$2 WHERE id=$1', [uid, newEmail])
    }

    async updatePassword(uid, newPassword) {
        await query('UPDATE users SET password=$2 WHERE id=$1', [
            uid,
            newPassword,
        ])
    }
}

module.exports = new UserQuery()
