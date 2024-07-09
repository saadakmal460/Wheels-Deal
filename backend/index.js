const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = require('./config');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
app.use(express.json());


mongoose
.connect(process.env.MONGO)
.then(()=>{

    console.log("Connected to DB");
    app.listen(PORT , ()=>{
        console.log("App is listening to port " + PORT);
    })

})
.catch((error)=>{
    console.log(error);
})

