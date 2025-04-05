const { Router } = require('express');
const controller = require('../controllers/controller')
const router = Router();
const passport = require('passport');
const session = require('express-session');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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
router.get("/folders/:folderTitle/:folderID", controller.filesPageGet)
router.get("/folders/folder-info/:folderID", controller.folderInfoPageGet);
router.get("/folders/folder-info/:folderID/update/", controller.updateFolderPageGet);
router.get("/folders/:folderTitle/:folderID/:fileName", controller.fileInfoPageGet);
router.get("/folders/:folderTitle/:folderID/:fileName/update", controller.updateFilePageGet);

// POST requests
router.post("/signup", controller.userSignUpPost);
router.post("/folders/:folderTitle/:folderID", upload.single('upload-file'), controller.newFilePost);
router.post("/folders", controller.newFolderPost);
router.post("/folders/folder-info/:folderID/delete", controller.deleteFolderPost);
router.post("/folders/folder-info/:folderID/update/", controller.updateFolderPost);
router.post("/folders/:folderTitle/:folderID/:fileName/update", controller.updateFilePost)
router.post("/folders/:folderTitle/:folderID/:fileName/delete", controller.deleteFilePost)


module.exports = router