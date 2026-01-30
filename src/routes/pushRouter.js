const express = require("express");
const { savePushSubscription } = require("../controller/pushController");
const {isLoggedIn} = require("../validations/authvalidator");

const pushRouter = express.Router();

pushRouter.post(
  "/subscribe",
  isLoggedIn,
  savePushSubscription
);
    
module.exports = pushRouter;