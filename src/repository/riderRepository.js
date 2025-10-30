const Rider = require("../schema/riderSchema");

const findRider = async (parameters) => {
  try {
    const response = await Rider.findOne({ ...parameters });
    return response;
  } catch (error) {
    console.log(error);
  }
}

async function createRider(riderDetails) {
    try {
        const response = await Rider.create(riderDetails);
        return response;
    } catch(error){
        console.log(error)
    }
}

const getRiderById = async (riderId) => {
  return await Rider.findById(riderId);
};

const getRiderByPhoneNumber = async (phoneNumber) => {
  return await Rider.findOne({ phoneNumber });
};

const updateRiderById = async (riderId, updateData) => {
  return await Rider.findByIdAndUpdate(riderId, updateData, { new: true });
};

const deleteRiderById = async (riderId) => {
  return await Rider.findByIdAndDelete(riderId);
};

module.exports = {
  createRider,
  getRiderById,
  getRiderByPhoneNumber,
  updateRiderById,
  deleteRiderById,
};