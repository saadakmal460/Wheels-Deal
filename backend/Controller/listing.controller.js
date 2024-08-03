const VehicleListingModel = require('../Models/vehiclelisting.model');



const Create = async(req,res,next)=>{

    try {
        const listing = await VehicleListingModel.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }

}



const GetLisintg = async (req,res,next)=>{
    try {
        const list = await VehicleListingModel.find({_id: req.params.id});
        return res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}

module.exports = {Create ,GetLisintg}