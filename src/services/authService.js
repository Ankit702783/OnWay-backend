const { findUser, setOTP, verifyOTP, clearOTP, createUser ,findUserByPhone, clearOTP2,setPhoneOTP, verifyPhoneOTP} = require('../repository/userRepository');
const { findRiderByPhone,riderOtpVerify ,setRiderOTP} = require('../repository/riderRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY ,GMAIL_PASS,GMAIL_USER,TWILIO_SID,TWILIO_AUTH_TOKEN,TWILIO_PHONE} = require("../config/serverConfig");
const nodemailer = require('nodemailer');
const twilio = require("twilio");
const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


async function loginUser(authDetails) {
    const email = authDetails.email;
    const plainPassword = authDetails.password;

    const user = await findUser({ email });
    if (!user) throw { message: "No user found with the given email", statusCode: 404 };

    const isPasswordValidated = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordValidated) throw { message: "Invalid password, please try again", statusCode: 401 };

    const userRole = user.role ? user.role : "USER";

    const token = jwt.sign({ email: user.email, id: user._id, role: userRole }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });

    return {
        token,
        userRole,
        userData: {
            email: user.email,
            firstName: user.firstName,
        }
    };
}



async function sendOTP(email) {
    let user = await findUser({ email });
    if (!user) user = await createUser({ email });

    const otp = generateOTP();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await setOTP(email, otp, expiry);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });

    await transporter.sendMail({
        from: GMAIL_USER,
        to: email,
        subject: 'Your OnWay OTP',
        text: `Your OTP for OnWay login is ${otp}. It is valid for 5 minutes.`
    });

    return { message: "OTP sent successfully" };
}

async function verifyUserOTP(email, otp) {
    const user = await verifyOTP(email, otp);
    if (!user) throw { message: "Invalid or expired OTP", statusCode: 401 };

    await clearOTP(email);

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });

    return {
        token,
        userData: { email: user.email, firstName: user.firstName }
    };
}



async function sendPhoneOTP(contactNumber) {

  const user = await findUserByPhone(contactNumber);
  if (!user) throw { message: "User with given phone number does not exist", statusCode: 404 };

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await setPhoneOTP(contactNumber, otp, expiry);

  await client.messages.create({
    body: `Your OnWay OTP is: ${otp}`,
    from: TWILIO_PHONE,
    to: contactNumber,
  });

  return { message: "OTP sent successfully" };
}

async function verifyPhoneUserOTP(contactNumber, otp) {
  const user = await verifyPhoneOTP(contactNumber, otp);
  if (!user) throw { message: "Invalid or expired OTP", statusCode: 401 };

  await clearOTP2(contactNumber);

  const token = jwt.sign({ id: user._id, contactNumber }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  return {
    token,
    user,
  };
}


async function sendRiderOTP(phoneNumber) {

  const user = await findRiderByPhone(phoneNumber);
  if (!user) throw { message: "User with given phone number does not exist", statusCode: 404 };

  const otp = generateOTP();
  const expiry = new Date(Date.now() + 5 * 60 * 1000);

  await setRiderOTP(phoneNumber, otp, expiry);

  await client.messages.create({
    body: `Your OnWay OTP is: ${otp}`,
    from: TWILIO_PHONE,
    to: phoneNumber,
  });

  return { message: "OTP sent successfully" };
}

async function verifyRiderOTP(phoneNumber, otp) {
  const user = await riderOtpVerify(phoneNumber, otp);
  if (!user) throw { message: "Invalid or expired OTP", statusCode: 401 };

  await clearOTP2(phoneNumber);
  const token = jwt.sign({ id: user._id, phoneNumber }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });

  return {
    token,
    user,
  };
}

module.exports = {
    loginUser,
    sendOTP,
    verifyUserOTP,
    sendPhoneOTP,
    verifyPhoneUserOTP,sendRiderOTP,
    verifyRiderOTP
};
