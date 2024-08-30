const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = require('./config');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const router = require('./Routes/Router');
const { Logger } = require('./Middleware/logger');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', router);
app.use(Logger);
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log("App is listening to port " + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
