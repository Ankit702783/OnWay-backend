const User = require('../schema/userSchema');
const Rider = require('../schema/riderSchema');

async function findUser(parameters) {
    try {
        const response = await User.findOne({ ...parameters });
        return response;
    } catch(error) {
        console.log(error);
    }
} 





async function createUser(userDetails) {
    try {
        const response = await User.create(userDetails);
        return response;
    } catch(error){
        console.log(error)
    }
}

async function getUserById(id){
    return await User.findById(id).select("-password -otp -otpExpiry");
}


async function setOTP(email, otp, expiry) {
    return await User.findOneAndUpdate(
        { email },
        { otp, otpExpiry: expiry },
        { new: true }
    );
}


async function verifyOTP(email, otp) {
    const user = await User.findOne({ email });
    if (!user) return null;
    const now = new Date();
    if (user.otp === otp && user.otpExpiry > now) {
     
        return user;
    }
    return null;
}

async function clearOTP(email) {
    return await User.findOneAndUpdate(
        { email },
        { otp: null, otpExpiry: null },
        { new: true }
    );
}

async function findUserByPhone(contactNumber) {
  return await User.findOne({ contactNumber });
}

async function setPhoneOTP(contactNumber, otp, expiry) {
  return await User.findOneAndUpdate(
    { contactNumber },
    { otp, otpExpiry: expiry },
    { upsert: true, new: true } 
  );
}

async function verifyPhoneOTP(contactNumber, otp) {
  const user = await User.findOne({ contactNumber, otp });
  if (!user) return null;
  if (user.otpExpiry < new Date()) return null;
  return user;
}

async function clearOTP2(contactNumber) {
  return await User.findOneAndUpdate(
    { contactNumber },
    { otp: null, otpExpiry: null }
  );
}

module.exports = {
    findUser,
    createUser,
    getUserById,
    setOTP,
    verifyOTP,
    clearOTP,
     findUserByPhone,
  setPhoneOTP,
  verifyPhoneOTP,
  clearOTP2,
  
};
