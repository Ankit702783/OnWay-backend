const {findRider, createRider, getRiderById, getRiderByPhoneNumber, updateRiderById, deleteRiderById} = require("../repository/riderRepository");

const registerRider = async (riderDetails) => {
  return await createRider(riderDetails);
};

const fetchRiderById = async (riderId) => {
  return await getRiderById(riderId);
};

const fetchRiderByPhoneNumber = async (phoneNumber) => {
  return await getRiderByPhoneNumber(phoneNumber);
};

const modifyRiderById = async (riderId, updateData) => {
  return await updateRiderById(riderId, updateData);
};

const removeRiderById = async (riderId) => {
  return await deleteRiderById(riderId);
};

module.exports = {
  registerRider,
  fetchRiderById,
  fetchRiderByPhoneNumber,
  modifyRiderById,
  removeRiderById,
};