const query = require('../db')

class CostQuery {
    async findByModel(model) {
        const data = await query(`SELECT * FROM costs WHERE model=$1`, [model])

        return data.rows
    }

    async findByModelAndResolution(model, resolution) {
        const data = await query(
            `SELECT * FROM costs WHERE model=$1 AND resolution=$2`,
            [model, resolution]
        )

        return data.rows
    }
}

module.exports = new CostQuery()
