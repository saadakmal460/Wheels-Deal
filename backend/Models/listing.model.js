const mongoose = require('mongoose')

const listingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discountPrice: {
        type: Number,
        required: true
    },


    beds: {
        type: Number,
        required: true
    },

    baths: {
        type: Number,
        required: true
    },

    furnished: {
        type: Boolean,
        required: true
    },


    parking: {
        type: Boolean,
        required: true
    },


    type: {
        type: String,
        required: true
    },


    offered: {
        type: Boolean,
        required: true
    },


    imageUrl: {
        type: Array,
        required: true
    },

    userRef:{
        type:String,
        required:true
    }



} , {timestamps : true});


const listingModel = mongoose.model('Listing' , listingSchema);

module.exports = listingModel;