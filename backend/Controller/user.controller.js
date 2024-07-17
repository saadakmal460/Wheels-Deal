const userModel = require('../Models/users.model');
const bcrypt = require('bcryptjs');
const customError = require('../Utils/error');


exports.userController = (req,res) =>{
    try {
        return res.status(200).json('Working');
    } catch (error) {
        return res.status(500).json(error);
        
    }
    
}


exports.UpdateUser = async (req,res,next) =>{
    if(req.params.id !== req.user.id) return next(customError(404 , 'Actions not Not Allowed'));

    try {
        if(req.body.password)
        {
            req.body.password=  bcrypt.hashSync(req.body.password , 10);
        }

        const updateUser = await userModel.findByIdAndUpdate(
            req.params.id , {
                $set:{
                   username:  req.body.username,
                   password:  req.body.password,
                   email:  req.body.email,
                   avatar:  req.body.avatar
                }
            },{new:true}
        )

        const { password: pass, ...rest } = updateUser._doc;

        
        res.status(200).json(rest)


    } catch (error) {

        next(error)
    }

    

}

