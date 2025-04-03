require('dotenv').config()
const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
const path = require('path')
const app = express();
const router = require('./routes/router')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');

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

// set-up express session for Session ID (SID) cookie & allow User database interactions
app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000, // 2 hours 
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(passport.session())

// for login and logout routes we define them here for now as passport is configured here... looking into better solution to declutter
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-fail', successRedirect: '/login-success' }),
  function(req, res) {
    res.redirect('/');
});

// so I can use locals.currentUser and access it in EJS files without having to pass it in a render each time
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
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