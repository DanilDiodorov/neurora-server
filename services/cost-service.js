const costQuery = require('../queries/cost-query')

class CostService {
    async findByModel(model) {
        const cost = await costQuery.findByModel(model)

        return cost[0]
    }

    async findByModelAndResolution(model, resolution) {
        const cost = await costQuery.findByModelAndResolution(model, resolution)

        return cost[0]
    }
}

module.exports = new CostService()
