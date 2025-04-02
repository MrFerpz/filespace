const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcryptjs');

function verifyPassword(username, password, done) {
    // verification logic 
    // --(compare the posted username using a database query)
    // --(compare the posted password with bcrypt.compare)
    // -----(if no match, return done(null, false) and apt error message)
    // --(return done(null, user) if successful)
}

// const strategy = new LocalStrategy(verifyPassword);
// passport.use(strategy)

// app.post('/login', 
//   passport.authenticate('local', { failureRedirect: '/login-fail', successRedirect: '/login-success' }),
//   function(req, res) {
//     res.redirect('/');
// });

// passport serialize user function

// passport deserialize user function