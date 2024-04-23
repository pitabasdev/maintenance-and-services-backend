const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const routes = require("./routes/Routes");
const cors = require('cors');

// Set up CORS options
const corsOptions = {
  origin: 'https://maintenance-and-services.vercel.app', // Update with your client's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Use CORS middleware
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);
app.options('*', cors(corsOptions)); // Set CORS options for preflight requests

mongoose
  .connect(process.env.MG_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 80, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
