const express = require('express');
const {
    login,
    logout,
    sendOtpController,
    verifyOtpController,
    sendOtpPhoneController,
    verifyOtpPhoneController,sendOtp,
    verifyOtp
} = require('../controller/authController');

const authRouter = express.Router();


authRouter.post('/login', login);
authRouter.post('/logout', logout);


authRouter.post('/send-otp', sendOtpController);
authRouter.post('/verify-otp', verifyOtpController);

authRouter.post("/send-phone-otp", sendOtpPhoneController);
authRouter.post("/verify-phone-otp", verifyOtpPhoneController);

authRouter.post("/send-rider-otp", sendOtp);
authRouter.post("/verify-rider-otp", verifyOtp);

module.exports = authRouter;
