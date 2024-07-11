const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = require('./config');
const dotenv = require('dotenv');
const router = require('./Routes/Router');
const {Logger} = require('./Middleware/logger')
dotenv.config();

const app = express();
app.use(express.json());


app.use('/api' , router);
app.use(cors());
app.use(Logger);

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

