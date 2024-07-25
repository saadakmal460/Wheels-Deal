const listingModel = require('../Models/listing.model');



const Create = async(req,res,next)=>{

    try {
        const listing = await listingModel.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }

}

module.exports = {Create}