const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const prismaClient = require('../db/prisma')

// we're using email which =/= username, so customFields is needed
const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

async function verifyPassword(email, password, done) {
    // load in the user from the email entered
    console.log(email, password);
    const user = await prismaClient.findUser(email);
    console.log(user);
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

// strategy defined
const strategy = new LocalStrategy(customFields, verifyPassword);
passport.use(strategy)

// passport sessions functions (from docs, fine to copy paste, don't need to call them)
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
passport.deserializeUser(async (id, done) => {
try {
    const user = await prismaClient.getUserByID(id);
    done(null, user);
} catch(err) {
    done(err);
}
});