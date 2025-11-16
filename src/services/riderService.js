const {
  findRider,
  createRider,
  getRiderById,
  getRiderByPhoneNumber,
  updateRiderById,
  deleteRiderById,
} = require("../repository/riderRepository");


async function riderfind(parameters) {
  try {
    const response = await findRider(parameters);
    return response;
  } catch (error) {
    console.log("Error in riderfind:", error);
  }
}

async function registerRider(riderDetails) {
  try {
    const response = await createRider(riderDetails);
    return response;
  } catch (error) {
    console.log("Error in registerRider:", error);
  }
}

async function fetchRiderById(riderId) {
  try {
    const response = await getRiderById(riderId);
    return response;
  } catch (error) {
    console.log("Error in fetchRiderById:", error);
  }
}

async function fetchRiderByPhoneNumber(phoneNumber) {
  try {
    const response = await getRiderByPhoneNumber(phoneNumber);
    return response;
  } catch (error) {
    console.log("Error in fetchRiderByPhoneNumber:", error);
  }
}

async function modifyRiderById(riderId, updateData) {
  try {
    const response = await updateRiderById(riderId, updateData);
    return response;
  } catch (error) {
    console.log("Error in modifyRiderById:", error);
  }
}

async function removeRiderById(riderId) {
  try {
    const response = await deleteRiderById(riderId);
    return response;
  } catch (error) {
    console.log("Error in removeRiderById:", error);
  }
}

module.exports = {
  riderfind,
  registerRider,
  fetchRiderById,
  fetchRiderByPhoneNumber,
  modifyRiderById,
  removeRiderById,
};
