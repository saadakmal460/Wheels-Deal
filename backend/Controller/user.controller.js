const userModel = require('../Models/users.model');
const bcrypt = require('bcryptjs');
const customError = require('../Utils/error');
const listingModel = require('../Models/vehiclelisting.model')

exports.userController = (req, res) => {
    try {
        return res.status(200).json('Working');
    } catch (error) {
        return res.status(500).json(error);

    }

}


exports.UpdateUser = async (req, res, next) => {
    if (req.params.id !== req.user.id) return next(customError(404, 'Actions not Not Allowed'));

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updateUser = await userModel.findByIdAndUpdate(
            req.params.id, {
            $set: {
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                avatar: req.body.avatar
            }
        }, { new: true }
        )

        const { password: pass, ...rest } = updateUser._doc;


        res.status(200).json(rest)


    } catch (error) {

        next(error)
    }



}


exports.deleteUser = async (req, res, next) => {

    if (req.params.id !== req.user.id) return next(customError(404, 'Actions not Not Allowed'));
    
    try {
        await userModel.findByIdAndDelete(req.params.id);
        res.clearCookie('acess_token');
        res.status(200).json('User Deleted Sucessfully')
    } catch (error) {
        next(error)

    }

}

exports.getListing = async (req, res, next) => {
    
    try {
        // Find listings by user reference ID
        const listings = await listingModel.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};
