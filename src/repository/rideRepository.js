
const Ride = require('../schema/rideSchema');

async function createRide(rideObj) {
  const ride = new Ride(rideObj);
  return await ride.save();
}

async function getRideById(rideId) {
  return await Ride.findById(rideId);
}

async function updateRide(rideId, update) {
  return await Ride.findByIdAndUpdate(rideId, update, { new: true });
}

module.exports = {
  createRide,
  getRideById,
  updateRide
};
