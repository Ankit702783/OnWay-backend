const { 
    loginUser, 
    sendOTP, 
    verifyUserOTP,
    sendPhoneOTP,
    verifyPhoneUserOTP
} = require("../services/authService");

const { COOKIE_SECURE } = require("../config/serverConfig");


/* -------------------- EMAIL + PASSWORD LOGIN -------------------- */
async function login(req, res) {
    try {
        const response = await loginUser(req.body);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SECURE ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: response,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Login failed",
            data: {},
        });
    }
}


/* -------------------- LOGOUT -------------------- */
async function logout(req, res) {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SECURE ? "none" : "lax",
        maxAge: 0,
    });

    res.status(200).json({
        success: true,
        message: "Log out successful",
        data: {}
    });
}


/* -------------------- EMAIL OTP SEND -------------------- */
async function sendOtpController(req, res) {
    try {
        const response = await sendOTP(req.body.email);

        res.status(200).json({
            success: true,
            message: response.message,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Failed to send OTP",
            data: {}
        });
    }
}


/* -------------------- EMAIL OTP VERIFY -------------------- */
async function verifyOtpController(req, res) {
    try {
        const response = await verifyUserOTP(req.body.email, req.body.otp);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SECURE ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: response,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "OTP verification failed",
            data: {}
        });
    }
}


/* -------------------- PHONE OTP SEND (ONLY IF USER EXISTS) -------------------- */
async function sendOtpPhoneController(req, res) {
    try {
        const response = await sendPhoneOTP(req.body.contactNumber);

        res.status(200).json({
            success: true,
            message: response.message,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
}


/* -------------------- PHONE OTP VERIFY → RETURN TOKEN + USER -------------------- */
async function verifyOtpPhoneController(req, res) {
    try {
        const response = await verifyPhoneUserOTP(req.body.contactNumber, req.body.otp);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SECURE ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: response,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
            data: {}
        });
    }
}



module.exports = {
    login,
    logout,
    sendOtpController,
    verifyOtpController,
    sendOtpPhoneController,
    verifyOtpPhoneController
};
