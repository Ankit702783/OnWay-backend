const Rider = require("../schema/riderSchema");

async function createRider(riderDetails) {
  try {
    const response = await Rider.create(riderDetails);
    return response;
  } catch (error) {
    console.log("Error in createRider:", error);
  }
}

async function findRider(parameters) {
  try {
    const response = await Rider.findOne({ ...parameters });
    return response;
  } catch (error) {
    console.log("Error in findRider:", error);
  }
}
async  function setRiderOTP(phoneNumber, otp, expiry) {
  
  return await Rider.findOneAndUpdate(
    { phoneNumber },
    { otp, otpExpiry: expiry },
    { new: true }
  );
} 
async function findRiderByPhone(phoneNumber) {
  try {
    const response = await Rider.findOne({ phoneNumber });
    return response;
  } catch (error) {
    console.log("Error in findRiderByPhone:", error);
  }
}

async function riderOtpVerify(phoneNumber, otp) {
  try {
    const rider = await Rider.findOne({ phoneNumber, otp });
  
    if (!rider) return null;
    if (rider.otpExpiry < new Date()) return null;
    return rider;
  } catch (error) {
    console.log("Error in riderOtpVerify:", error);
  }
}

async function getRiderById(riderId) {
  try {
    const response = await Rider.findById(riderId);
    return response;
  } catch (error) {
    console.log("Error in getRiderById:", error);
  }
}

async function getRiderByPhoneNumber(phoneNumber) {
  try {
    const response = await Rider.findOne({ phoneNumber });
    return response;
  } catch (error) {
    console.log("Error in getRiderByPhoneNumber:", error);
  }
}

async function updateRiderById(riderId, updateData) {
  try {
    const response = await Rider.findByIdAndUpdate(riderId, updateData, { new: true });
    return response;
  } catch (error) {
    console.log("Error in updateRiderById:", error);
  }
}

async function deleteRiderById(riderId) {
  try {
    const response = await Rider.findByIdAndDelete(riderId);
    return response;
  } catch (error) {
    console.log("Error in deleteRiderById:", error);
  }
}

module.exports = {
  createRider,
  findRider,
  getRiderById,
  getRiderByPhoneNumber,
  updateRiderById,
  deleteRiderById,
  findRiderByPhone,
  riderOtpVerify,setRiderOTP
};
