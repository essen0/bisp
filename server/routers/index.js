const Router = require('express').Router
const userController = require('../controllers/userController')
const UserController = require('../controllers/userController')
const {body} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:12}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)
router.post('/forgotPassword',userController.forgotPassword)

module.exports = router