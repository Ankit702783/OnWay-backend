const express = require('express');
const {createUser}=require('../controller/userController')
const { isLoggedIn } = require("../validations/authvalidator");


const userRouter = express.Router();  

userRouter.post('/', createUser); 


module.exports = userRouter; 