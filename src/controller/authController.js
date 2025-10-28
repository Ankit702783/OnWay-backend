const { loginUser, sendOTP, verifyUserOTP ,sendPhoneOTP, verifyPhoneUserOTP} = require("../services/authService");
const { COOKIE_SECURE ,GMAIL_PASS,GMAIL_USER} = require("../config/serverConfig");


async function login(req, res) {
    try {
        const loginPayload = req.body;
        const response = await loginUser(loginPayload);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SECURE ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: {
                userRole: response.userRole,
                userData: response.userData,
                token: response.token,
            },
            error: {}
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            data: {},
            message: error.message || "Login failed",
            error: error
        });
    }
}


async function logout(req, res) {
    res.cookie("authToken", "", {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: COOKIE_SECURE ? "none" : "lax",
        maxAge: 0,
    });

    return res.status(200).json({
        success: true,
        message: "Log out successful",
        error: {},
        data: {}
    });
}


async function sendOtpController(req, res) {
    try {
        const { email } = req.body;
        const response = await sendOTP(email);

        return res.status(200).json({
            success: true,
            message: response.message,
            data: {},
            error: {}
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            data: {},
            message: error.message || "Failed to send OTP",
            error: error
        });
    }
}

async function verifyOtpController(req, res) {
    try {
        const { email, otp } = req.body;
        const response = await verifyUserOTP(email, otp);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: COOKIE_SECURE,
            sameSite: COOKIE_SECURE ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            data: {
                userRole: response.userRole,
                userData: response.userData,
                token: response.token
            },
            error: {}
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            data: {},
            message: error.message || "OTP verification failed",
            error: error
        });
    }
}




async function sendOtpPhoneController(req, res) {
  try {
    const { contactNumber } = req.body;
    const response = await sendPhoneOTP(contactNumber);

    res.status(200).json({
      success: true,
      message: response.message,
      data: {},
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to send OTP",
      error,
      data: {},
    });
  }
}

async function verifyOtpPhoneController(req, res) {
  try {
    const { contactNumber, otp } = req.body;
    const response = await verifyPhoneUserOTP(contactNumber, otp);

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
      error: {},
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "OTP verification failed",
      error,
      data: {},
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
