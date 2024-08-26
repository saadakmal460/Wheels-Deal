const VehicleListingModel = require('../Models/vehiclelisting.model');
const customError = require('../Utils/error')


const parseSearchTerm = (searchTerm) => {
    const parts = searchTerm.split(' ').filter(part => part.trim() !== '');
    const make = parts[0] || '';
    const model = parts.slice(1).join(' ') || '';

    return { make, model };
};


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

const AllListings = async (req, res, next) => {
    try {
        const listings = await VehicleListingModel.find();

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}


const FilteredListing = async (req, res, next) => {
    try {
        const {
            search = '',
            minPrice = null,
            maxPrice = null,
            condition = '',
            transmission = '',
            fuelType = '',
            location = '',
            year = null,
        } = req.query;

        
        const query = {};

        
        if (search) {
            
            const searchKeywords = search.split(' ').map(keyword => keyword.trim()); 

            
            const orConditions = searchKeywords.map(keyword => ({
                $or: [
                    { make: { $regex: new RegExp(keyword, 'i') } }, 
                    { model: { $regex: new RegExp(keyword, 'i') } } 
                ]
            }));

            
            query.$and = orConditions;
        }

        
        if (minPrice || maxPrice) {
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

            if (min <= max) {
                query.price = {
                    $gte: min,
                    $lte: max
                };
            } else {
                query.price = {
                    $gte: 0,
                    $lte: 0
                };
            }
        }

        
        if (year) {
            query.year = year;
        }

        
        if (condition) {
            query.condition = condition;
        }

        if (transmission) {
            query.transmission = transmission;
        }

        if (fuelType) {
            query.fuelType = fuelType;
        }

        
        if (location) {
            const locationRegex = new RegExp(location, 'i');
            query.sellerAddress = { $regex: locationRegex };
        }


        const listings = await VehicleListingModel.find(query);

        res.json({ success: true, data: listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};







module.exports = { Create, GetLisintg, DeleteListing, EditListing, AllListings, FilteredListing }