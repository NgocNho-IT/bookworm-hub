const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');
const { validateLogin, validateRegister } = require('../middlewares/userMiddleware');

userRouter.get("/register", userController.showRegister);
userRouter.post("/register", validateRegister, userController.register);

userRouter.get("/login", userController.showLogin);
userRouter.post("/login", validateLogin, userController.login);

userRouter.get("/logout", userController.logout);

module.exports = userRouter;