const { Router } = require('express');
const controller = require('../controllers/controller')
const router = Router();
const passport = require('passport');
const session = require('express-session');

// function to act as an authentication check
function checkAuthentication(req, res, next){
    if(req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}

// GET requests
router.get("/", controller.indexPageGet);
router.get("/signup", controller.signUpPageGet);
router.get("/login", controller.loginPageGet);
router.get("/login-fail", controller.loginFailPageGet);
router.get("/login-success", controller.loginSuccessPageGet);
router.get("/files", checkAuthentication, controller.filePageGet);
router.get("/new-folder", controller.newFolderGet);

// POST requests
router.post("/signup", controller.userSignUpPost);

module.exports = router