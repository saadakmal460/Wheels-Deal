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
            location = ''
        } = req.query;

        // Initialize query object
        const query = {};

        // Handle search term
        if (search) {
            const { make, model } = parseSearchTerm(search);
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search

            const orConditions = [];

            // Add conditions to $or array if they are defined
            if (make) {
                orConditions.push({ make: { $regex: make, $options: 'i' } });
            }

            if (model) {
                orConditions.push({ model: { $regex: model, $options: 'i' } });
            }

            // Always include description and sellerAddress search
            orConditions.push(
                { description: searchRegex },
                { sellerAddress: searchRegex }
            );

            if (orConditions.length > 0) {
                query.$or = orConditions;
            }
        }

        // Handle price range
        if (minPrice || maxPrice) {
            // Convert to numbers and apply defaults if necessary
            const min = minPrice ? parseFloat(minPrice) : 0;
            const max = maxPrice ? parseFloat(maxPrice) : Number.MAX_SAFE_INTEGER;

            // Ensure min is less than or equal to max
            if (min <= max) {
                query.price = {
                    $gte: min,
                    $lte: max
                };
            } else {
                // If minPrice is greater than maxPrice, return an empty result
                query.price = {
                    $gte: 0,
                    $lte: 0
                };
            }
        }

        // Handle other filters
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
            query.location = { $regex: location, $options: 'i' }; // Case-insensitive search
        }

        // Debugging: Log the query object
        console.log('Query Object:', query);

        // Fetch listings from the database
        const listings = await VehicleListingModel.find(query);

        // Debugging: Log the number of results
        console.log('Number of Listings Found:', listings.length);

        // Return the listings
        res.json({ success: true, data: listings });
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
}

module.exports = { Create, GetLisintg, DeleteListing, EditListing, AllListings, FilteredListing }