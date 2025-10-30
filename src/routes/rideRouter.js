const express = require('express');
const {calculateRideFare}=require('../controller/rideController')



const rideRouter = express.Router();

rideRouter.post('/calculate', calculateRideFare);

module.exports = rideRouter;