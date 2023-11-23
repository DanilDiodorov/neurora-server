const Router = require('express')
const router = new Router()

const userRouter = require('./user-router')
const chatsRouter = require('./chats-router')
const messageRouter = require('./messages-router')

router.use('/users', userRouter)
router.use('/chats', chatsRouter)
router.use('/messages', messageRouter)

module.exports = router
