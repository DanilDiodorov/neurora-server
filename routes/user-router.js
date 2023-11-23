const Router = require('express')
const userController = require('../controllers/user-controller')
const router = new Router()
const authMiddleware = require('../middleware/auth-middleware')
const { body } = require('express-validator')

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 30 }),
    userController.registration
)
router.post('/login', userController.login)
router.get('/refresh', userController.refresh)
router.post('/logout', authMiddleware, userController.logout)
router.post('/check-code', authMiddleware, userController.checkCode)
router.post('/resend-code', authMiddleware, userController.resendCode)
router.post(
    '/new-password',
    body('email').isEmail(),
    userController.newPassword
)
router.post(
    '/change-email',
    authMiddleware,
    body('newEmail').isEmail(),
    userController.changeEmail
)

module.exports = router
