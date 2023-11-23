const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth-middleware')
const { body } = require('express-validator')
const chatController = require('../controllers/chat-controller')

router.post(
    '/add',
    body('name').isLength({ min: 1, max: 30 }),
    authMiddleware,
    chatController.addChat
)
router.get('/get', authMiddleware, chatController.getAllChats)
router.post('/delete', authMiddleware, chatController.deleteChat)

module.exports = router
