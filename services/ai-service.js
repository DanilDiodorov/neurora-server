const OpenAI = require('openai')
require('dotenv').config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.proxyapi.ru/openai/v1',
})

class AiService {
    async generateResponseStream(prompt, model) {
        try {
            const response = await openai.chat.completions.create({
                model,
                messages: prompt,
                stream: true,
            })
            return response
        } catch (e) {
            console.log(e)
        }
    }

    async generateImage(promt) {
        try {
            const response = await openai.images.generate({
                promt: 'a black cat',
                n: 1,
                size: '256x256',
            })

            return response.data.data[0].url
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new AiService()
