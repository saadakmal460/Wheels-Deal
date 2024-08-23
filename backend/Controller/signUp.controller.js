
const userModel = require('../Models/users.model')
const bcrypt = require('bcryptjs');
const customError = require('../Utils/error');

exports.signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            
            return next(customError(400, 'This email is already in use'));
        }

        
        const hashedPassword = bcrypt.hashSync(password, 10);

        
        const newUser = new userModel({
            username,
            email,
            password: hashedPassword,
        });

        
        await newUser.save();

        
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        // Handle any errors that occur
        next(error);
    }
};

