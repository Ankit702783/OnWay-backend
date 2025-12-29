const express = require('express');
const { 
  calculateRideFare,
  createRide
} = require('../controller/rideController');
const{isLoggedIn}=require("../validations/authvalidator")
const{isLogIn}=require("../validations/userValidator")

const rideRouter = express.Router();


rideRouter.post('/calculate', calculateRideFare);


rideRouter.post('/create', isLogIn, createRide);

module.exports = rideRouter;
