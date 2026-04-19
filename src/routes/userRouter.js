const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController.js');

userRouter.get("/register", userController.showRegister);
userRouter.post("/register", userController.register);

userRouter.get("/login", userController.showLogin);

module.exports = userRouter;