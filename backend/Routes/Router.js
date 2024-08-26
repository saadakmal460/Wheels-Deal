const express = require('express');
const {userController , UpdateUser , deleteUser , getListing} = require('../Controller/user.controller')
const {signUp} = require('../Controller/signUp.controller')
const {signIn , SignOut} = require('../Controller/signIn.controller')
const {verifyUser} = require('../Utils/verifyUser')
const {Create, GetLisintg, DeleteListing, EditListing, AllListings, FilteredListing} = require('../Controller/listing.controller')




const router = express.Router();

router.get('/test' , userController);


 // AUTH ROUTES
router.post('/signup' , signUp);
router.post('/signIn' , signIn);
router.get('/signOut' ,   SignOut);

// USER ROUTES
router.post('/updateUser/:id' ,  verifyUser , UpdateUser);
router.delete('/deleteUser/:id' ,  verifyUser , deleteUser);
router.get('/userListings/:id' ,  verifyUser , getListing);



// LISTING ROUTES
router.post('/lsiting/create' , verifyUser , Create);
router.get('/listing/:id' , verifyUser , GetLisintg);
router.delete('/delete/:id' , verifyUser , DeleteListing);
router.patch('/updateListing/:id' , verifyUser , EditListing);
router.get('/listings'  , AllListings);
router.get('/filtered/listings'  , FilteredListing);







module.exports = router