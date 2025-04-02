const { Router } = require('express');
const controller = require('../controllers/controller')
const router = Router();

// GET requests
router.get("/", controller.indexPageGet);
router.get("/signup", controller.signUpPageGet);
router.get("/login", controller.loginPageGet);
router.get("/login-fail", controller.loginFailPageGet);
router.get("/login-success", controller.loginSuccessPageGet);

// POST requests
router.post("/signup", controller.userSignUpPost);

module.exports = router