const {validationResult} = require('express-validator')
const User = require('../models/user')
const History = require('../models/history')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.postRegister = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {email, password, confirmPassword, admin} = req.body;
    if (confirmPassword != password) {
        const error = new Error('Password & Confirm Password is not the same!')
        error.statusCode = 422;
        throw error;
    } else {
        User.findOne({
            email: email
        })
        .then(userDoc => {
            if (userDoc) {
                const error = new Error('Email is already registered!')
                error.statusCode = 422;
                throw error;
            } else {
                bcrypt
                    .hash(password, 12)
                    .then(hashedPassword => {
                        const newUser = new User ({
                            email: email,
                            password: hashedPassword,
                            admin: admin
                        })
                        return newUser.save();
                    })
                    .then((result) => {
                        History.create({
                            wins: 0,
                            losses: 0,
                            user_id: result._id
                        })
                        res.status(201).json({
                            message: 'User created!',
                            userId: result._id
                        })
                    })
                    .catch(error => {
                        next(error)
                    })
            }
        })
        .catch(error => {
            next(error)
        })
    }
}

exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const {email, password} = req.body;
    User.findOne({
        email: email
    })
    .then(user => {
        if (!user) {
            const error = new Error(email + ' doesn\'t exist')
            error.statusCode = 401;
            throw error;
        }
        bcrypt
            .compare(password, user.password)
            .then((same) => {
                if (!same) {
                    const error = new Error('Password don\'t match')
                    error.statusCode = 401
                    throw error
                }
                const token = jwt.sign({email: user.email, userId: user._id},'secret', {expiresIn: '1h'})
                res.status(200).json({
                        message: 'Login successful!',
                        token: token, 
                        email: user.email,
                        admin: user.admin,
                        userId: user._id
                })
            })


    }).catch(error => {
        next(error)
    })
}

