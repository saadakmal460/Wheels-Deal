const express = require('express');
const {userController} = require('../Controller/user.controller')
const {signUp} = require('../Controller/signUp.controller')

const router = express.Router();

router.get('/test' , userController);

router.post('/signup' , signUp );

module.exports = router