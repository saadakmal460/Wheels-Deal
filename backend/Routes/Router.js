const express = require('express');
const {userController , UpdateUser , deleteUser} = require('../Controller/user.controller')
const {signUp} = require('../Controller/signUp.controller')
const {signIn , SignOut} = require('../Controller/signIn.controller')
const {verifyUser} = require('../Utils/verifyUser')



const router = express.Router();

router.get('/test' , userController);

router.post('/signup' , signUp );
router.post('/signIn' , signIn );


router.post('/updateUser/:id' ,  verifyUser , UpdateUser);
router.delete('/deleteUser/:id' ,  verifyUser , deleteUser);
router.get('/signOut' ,   SignOut);






module.exports = router