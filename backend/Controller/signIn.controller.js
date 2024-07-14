const userModel = require('../Models/users.model');
const bcrypt = require('bcryptjs');
const customError = require('../Utils/error')
const jwt = require('jsonwebtoken');

const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const valid = await userModel.findOne({ email });
        if (!valid) return next(customError(404, 'User not found'));

        const validPass = bcrypt.compareSync(password, valid.password);

        if (!validPass) return next(customError(401, 'Wrong Credentials'));

        const {password:pass , ...rest} = valid._doc;

        const tokken = jwt.sign({id : valid._id} , process.env.JWT_SECERT);
        res.cookie('acess_tokken' , tokken , {httpOnly:true}).status(200).json(rest)

        

    } catch (error) {
        next(error);
    }

}


const googleSignIn = async(req,res,next) =>{

    try {
        
        const user = await userModel.findOne({email : req.body.email});
        
        if(user){
            const {password:pass , ...rest} = user._doc;
            const tokken = jwt.sign({id : user._id} , process.env.JWT_SECERT);
            res.cookie('acess_tokken' , tokken , {httpOnly:true}).status(200).json(rest)
            

        } else {
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassowrd = bcrypt.hashSync(generatePassword , 10);

            const createUser  = new userModel({
                username : req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email :    req.body.email,
                password : hashedPassowrd,
                avatar : req.body.photo
            });

            await createUser.save();
            
            const {password:pass , ...rest} = createUser._doc;
            const tokken = jwt.sign({id : createUser._id} , process.env.JWT_SECERT);
            res.cookie('acess_tokken' , tokken , {httpOnly:true}).status(200).json(rest)

        }
        
    } catch (error) {
        next(error);
    }

}


module.exports = {signIn , googleSignIn};