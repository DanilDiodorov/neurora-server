const query = require('../db')

class MessageQuery {
    async set(chatID, type, text, url, createdAt, isMy) {
        await query(
            'INSERT INTO messages (chat_id, type, text, url, created_at, is_my) VALUES ($1, $2, $3, $4, $5, $6)',
            [chatID, type, text, url, createdAt, isMy]
        )
    }

    async findByChatID(chatID, offset, limit) {
        let data
        if (limit === null && offset == null) {
            data = await query(
                'SELECT * FROM messages WHERE chat_id=$1 ORDER BY id DESC',
                [chatID]
            )
        } else {
            data = await query(
                'SELECT * FROM messages WHERE chat_id=$1 ORDER BY id DESC OFFSET $2 LIMIT $3',
                [chatID, offset, limit]
            )
        }
        return data.rows
    }

    async deleteByChatID(chatID) {
        await query('DELETE FROM messages WHERE chat_id=$1', [chatID])
    }
}

module.exports = new MessageQuery()
