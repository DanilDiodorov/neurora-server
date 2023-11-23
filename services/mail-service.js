const nodemailer = require('nodemailer')
require('dotenv').config()

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            secure: false,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendActivationMail(to, code) {
        await this.transporter.sendMail({
            from: 'Neurora gpt',
            to,
            subject: 'Код для активации',
            text: '',
            html: `
                <div>
                    <h2>Ваш код для активации: <p>${code}</p></h2>
                </div>
            `,
        })
    }

    async sendNewPassword(to, newPassword) {
        await this.transporter.sendMail({
            from: 'Neurora gpt',
            to,
            subject: 'Новый пароль',
            text: '',
            html: `
                <div>
                    <h2>Ваш новый пароль: <p>${newPassword}</p></h2>
                </div>
            `,
        })
    }
}

module.exports = new MailService()
