const codeQuery = require('../queries/code-query')

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

class CodeService {
    async generateCode(uid) {
        const code = getRandomArbitrary(1000, 9999)
        const codeData = await this.find(uid)
        if (codeData === null) {
            await codeQuery.set(uid, code)
        } else {
            await codeQuery.update(uid, code)
        }

        return code
    }

    async deleteCode(uid) {
        const data = await codeQuery.delete(uid)

        return data
    }

    async find(uid) {
        const codeData = await codeQuery.findByUid(uid)

        if (codeData.length !== 0) {
            return codeData[0].code
        } else {
            return null
        }
    }
}

module.exports = new CodeService()
