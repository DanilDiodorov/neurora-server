const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth-middleware')
const messageController = require('../controllers/message-controller')

router.post('/get', authMiddleware, messageController.findByChatID)
router.post('/delete', authMiddleware, messageController.deleteByChatID)

module.exports = router
