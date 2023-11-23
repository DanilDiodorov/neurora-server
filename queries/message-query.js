const query = require('../db')

class MessageQuery {
    async set(chatID, type, text, url, createdAt, isMy) {
        await query(
            'INSERT INTO messages (chat_id, type, text, url, created_at, isMy) VALUES ($1, $2, $3, $4, $5, $6)',
            [chatID, type, text, url, createdAt, isMy]
        )
    }

    async findByChatID(chatID, limit) {
        let data
        if (limit === null) {
            data = await query(
                'SELECT * FROM messages WHERE chat_id=$1 ORDER BY id',
                [chatID]
            )
        } else {
            data = await query(
                'SELECT * FROM messages WHERE chat_id=$1 ORDER BY id DESC LIMIT $2',
                [chatID, limit]
            )
        }
        return data.rows
    }

    async deleteByChatID(chatID) {
        await query('DELETE FROM messages WHERE chat_id=$1', [chatID])
    }
}

module.exports = new MessageQuery()
