const express = require('express');
const {userController} = require('../Controller/user.controller')
const {signUp} = require('../Controller/signUp.controller')
const {signIn , googleSignIn} = require('../Controller/signIn.controller')

const router = express.Router();

router.get('/test' , userController);

router.post('/signup' , signUp );
router.post('/signIn' , signIn );
router.post('/signIn/google' , googleSignIn);



module.exports = router