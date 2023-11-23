const query = require('../db')

class ChatQuery {
    async set(name, uid, type, model, param, createdAt, canEdit) {
        const data = await query(
            'INSERT INTO chats (name, type, model, param, uid, createdat, canedit) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, type, model, param, uid, createdAt, canEdit]
        )
        return data
    }

    async findByUid(uid) {
        const data = await query('SELECT * FROM chats WHERE uid=$1', [uid])
        return data
    }

    async delete(id) {
        const data = await query('DELETE FROM chats WHERE id=$1 RETURNING *', [
            id,
        ])
        return data
    }
}

module.exports = new ChatQuery()
