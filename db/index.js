const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: {
        require: true,
    },
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}

module.exports = query
