const express = require('express')
const {body} = require('express-validator')
const isAuth = require('../middleware/is-auth')
const roomController = require('../controllers/room')
const router = express.Router()

router.post('/create-room', isAuth, 
    body('name')
    .notEmpty()
    .withMessage('Room name must be specified!'),
    roomController.postRoom
)

router.get('/fight/:room_id', isAuth, roomController.getRoomFight)

module.exports = router;