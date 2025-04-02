const { Router } = require('express');
const controller = require('../controllers/controller')
const router = Router();

// GET requests
router.get("/", controller.indexPageGet);
router.get("/signup", controller.signUpPageGet);

// POST requests
router.post("/signup", controller.userSignUpPost);

module.exports = router