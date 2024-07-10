
const userModel = require('../Models/users.model')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res , next) => {

    try {
        const { username, email, password } = req.body;

        const hashedPassword = bcrypt.hashSync(password , 10);
        const newUser = new userModel({ username, email, password:hashedPassword });
        
        await newUser.save();

        return res.status(201).json(req.body);
    } catch (error) {
        next(error);
    }

}

