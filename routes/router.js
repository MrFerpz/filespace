const { Router } = require('express');
const controller = require('../controllers/controller')
const router = Router();
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

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
router.get("/folders", checkAuthentication, controller.foldersPageGet);
router.get("/new-folder", controller.newFolderGet);
router.get("/files/folder/:foldername", controller.filesPageGet)

// POST requests
router.post("/signup", controller.userSignUpPost);
router.post("/new-file", upload.single('upload-file'), controller.filesPageGet);

module.exports = router