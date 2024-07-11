const userModel = require('../Models/users.model');
const bcrypt = require('bcryptjs');
const customError = require('../Utils/error')
const jwt = require('jsonwebtoken');

exports.signIn = async (req, res, next) => {
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