const express = require('express')
const {body} = require('express-validator')
const authController = require('../controllers/auth')
const router = express.Router()

router.post('/register',
    body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    body('password')
    .isLength({min: 8, max: 16})
    .withMessage('Password, minimum 8 & maximum 16 characters'),
    body('confirmPassword')
    .notEmpty()
    .withMessage('Fill in confirm password!'),
    body('admin')
    .notEmpty()
    .withMessage('Fill in admin status!')
    .isBoolean()
    .withMessage('Admin must be boolean!'),
    authController.postRegister
)

router.post('/login', authController.postLogin)

module.exports = router