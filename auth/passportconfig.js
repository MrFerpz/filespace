const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

function verifyPassword(email, password, done) {
    // load in the user from the email entered
    const user = prisma.findUser(email);

    // if they don't exist (emails don't match) 
    if (!user) {
        console.log("Error, user not found");
        return done(null, false)
    }

    // check if passwords are a match
    if (bcrypt.compare(password, user.password)) {
        console.log("Log-in successful");
        return done(null, user)
    } else {
        console.log("Log-in failed, incorrect password")
        return done(null, false)
    }
}

const strategy = new LocalStrategy(verifyPassword, customFields);
passport.use(strategy)

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-fail', successRedirect: '/login-success' }),
  function(req, res) {
    res.redirect('/');
});

// passport serialize user function
// passport deserialize user function