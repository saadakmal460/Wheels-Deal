const mongoose = require('mongoose');
const { type } = require('os');

const vehicleSchema = mongoose.Schema({
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    mileage: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ['new', 'used'],
        required: true
    },
    transmission: {
        type: String,
        enum: ['automatic', 'manual'],
        required: true
    },
    fuelType: {
        type: String,
        enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg', 'hydrogen'],
        required: true
    },
    sellerContact:{
        type:String,
        required:true
    },
    sellerAddress:{
        type:String,
        required:true
    },
    imageUrls: {
        type: Array,
        required: true
    },
    userRef: {
        type: String,
        required: true
    }
}, { timestamps: true });

const VehicleModel = mongoose.model('Vehicle', vehicleSchema);

module.exports = VehicleModel;
