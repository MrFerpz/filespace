const prismaClient = require('../db/prisma');
const bcrypt = require('bcryptjs');

// GET requests
function indexPageGet(req, res) {
    res.render("index", {message: "Hello there!"})
}

function signUpPageGet(req, res) {
    res.render("signup")
}

function loginPageGet(req, res) {
    res.render("login")
}

function loginFailPageGet(req, res) {
    res.render("login-fail")
}

function loginSuccessPageGet(req, res) {
    res.render("login-success")
}

function filePageGet(req, res) {
    res.render("files", {folders: ["recipes", "films", "work", "repos", "life admin"]});
}

function newFolderGet(req, res) {
    res.render("new-folder")
}

//---------------------------//

// POST requests
async function userSignUpPost(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, 10);
    try {
        prismaClient.createUser(username, email, password);
    } catch(error) {
        console.log(error);
        const message = "Sorry, you couldn't sign up this time."
        res.render("index", {message: message});
    }
    const message = "Successfully signed up.";
    res.render("index", {message: message});
}

module.exports = {
    indexPageGet,
    userSignUpPost,
    signUpPageGet,
    loginPageGet,
    loginFailPageGet,
    loginSuccessPageGet,
    filePageGet,
    newFolderGet
}