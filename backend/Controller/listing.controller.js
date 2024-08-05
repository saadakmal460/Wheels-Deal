const VehicleListingModel = require('../Models/vehiclelisting.model');
const customError = require('../Utils/error')


const Create = async (req, res, next) => {

    try {
        const listing = await VehicleListingModel.create(req.body);
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }

}



const GetLisintg = async (req, res, next) => {


    try {
        const list = await VehicleListingModel.find({ _id: req.params.id });
        return res.status(200).json(list);
    } catch (error) {
        next(error);
    }
}


const DeleteListing = async (req, res, next) => {
    try {
        const list = await VehicleListingModel.findOneAndDelete({ _id: req.params.id });
        return res.status(200).json(list);

    } catch (error) {
        next(error);
    }
}


const EditListing = async (req, res, next) => {
    try {
        const updatedListing = await VehicleListingModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );

        if (!updatedListing) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.status(200).json({ success: true, data: updatedListing });
    } catch (error) {
        next(error);
    }
};

module.exports = { Create, GetLisintg, DeleteListing, EditListing }