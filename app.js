require('dotenv').config()
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const path = require('path')
const app = express();
const router = require('./routes/router')

// set directory folder for CSS & images
app.use('/static', express.static('public'))

// set EJS view engine & directory
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));

// set middleware for POST forms
app.use(express.urlencoded({ extended: true }));

// send to router
app.use("/", router);

console.log("Server live at localhost:3000!");
app.listen(3000);