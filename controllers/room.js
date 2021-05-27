const {validationResult} = require('express-validator')
const History = require('../models/history')
const Room = require('../models/room')
const jwt = require('jsonwebtoken')

exports.postRoom = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    Room
    .create({name: name, creator_id: req.userId})
    .then(result => {
        if (!result) {
            const error = new Error('Room creation failed!')
            error.statusCode = 422;
            throw error;
        } 
        res.json({
            message: "Room successfully created",
            roomName: result.name,
            roomId: result._id
        })
    })
    .catch(error => {
        next(error)
    }) 
}

exports.getRoomFight = async (req, res, next) => {
    const room_id = req.params.room_id
    Room
    .findById(room_id)
    .then(async (result) => {
        if (!result) {
            const error = new Error('Room not found!')
            error.statusCode = 422;
            throw error;
        }
        const status = Math.floor(Math.random()*2)
        var historyNow = await History.findOne({user_id: req.userId})
        if (historyNow) {
            if (status == 0) {
            History.findOneAndUpdate({user_id: req.userId}, {wins: historyNow.wins+1}).then(result => {
                History.findOne({user_id: req.userId}).then(result =>{
                    res.json({
                        message: "You win!",
                        wins: result.wins,
                        losses: result.losses
                    })
                })
            })
            } else if (status == 1) {
            History.findOneAndUpdate({user_id: req.userId}, {losses: historyNow.losses+1}).then(result => {
                History.findOne({user_id: req.userId}).then(result =>{
                    res.json({
                        message: "You lost!",
                        wins: result.wins,
                        losses: result.losses
                    })
                })
                })
            }
        } else {
            const error = new Error('Log in with the correct token!')
            error.statusCode = 422;
            throw error; 
        }
        
    }).catch(error => {
        next(error)
    })
}