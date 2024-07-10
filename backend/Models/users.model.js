const moongose = require('mongoose');

const userSchema = moongose.Schema({
    username:{
        type:String,
        required : true,
        unique : true
    },
    email:{
        type:String,
        required : true,
        unique : true
    },
    password:{
        type:String,
        required : true,
    }
} , {timestamps:true})

const userModel = moongose.model('User' , userSchema);

module.exports= userModel;