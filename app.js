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

// ----------- passport set-up ----------

// load-in the config
require('./auth/passportconfig');

// set-up express session for Session ID (SID) cookie
app.use(session(
    {secret: "secret words shhh!!",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 24 * 1000}}
))

app.use(passport.session())

// for login and logout routes we define them here for now as passport is configured here... looking into better solution to declutter
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-fail', successRedirect: '/login-success' }),
  function(req, res) {
    res.redirect('/');
});

// let them log-out as well - passport has .logout() built in
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});

// otherwise,send to router
app.use("/", router);

console.log("Server live at http://localhost:3000 !");
app.listen(3000);