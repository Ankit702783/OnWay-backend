const express = require('express');
const { 
  calculateRideFare,
  createRide
} = require('../controller/rideController');
const{isLoggedIn}=require("../validations/authvalidator")

const rideRouter = express.Router();


rideRouter.post('/calculate', calculateRideFare);


rideRouter.post('/create', isLoggedIn, createRide);

module.exports = rideRouter;
