const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/auth-middleware')
const walletController = require('../controllers/wallet-controller')

router.post('/get', authMiddleware, walletController.find)

module.exports = router
