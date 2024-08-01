const customError = require('../Utils/error')
const jwt = require('jsonwebtoken');


exports.verifyUser = (req,res,next)=>{

    const tokken = req.cookies.acess_tokken;

    if(!tokken){
        return next(customError(401 , 'Actions Unauthorized'));
    } 
    

    jwt.verify(tokken , process.env.JWT_SECERT , (error , user)=>{
        if(error) return next(customError(401 , 'Error Ocurred'));

        req.user = user;
        next();
    })


}