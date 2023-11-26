const Router = require('express')
const router = new Router()

const userRouter = require('./user-router')
const chatsRouter = require('./chats-router')
const messageRouter = require('./messages-router')
const walletRouter = require('./wallet-router')

router.use('/users', userRouter)
router.use('/chats', chatsRouter)
router.use('/messages', messageRouter)
router.use('/wallets', walletRouter)

module.exports = router
