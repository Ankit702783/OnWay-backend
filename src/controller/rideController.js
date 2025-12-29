const { getRideEstimate, createRideAndGenerateSlip } = require('../services/rideService');
const { getIO } = require('../socket');
const Rider = require('../schema/riderSchema');

async function calculateRideFare(req, res) {
  try {
    const { pickup, drop } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({ message: "Pickup and drop locations are required" });
    }

    const rideData = await getRideEstimate(pickup, drop);
    return res.status(200).json(rideData);

  } catch (error) {
    console.error("Ride calculation error:", error.message);
    return res.status(500).json({ message: "Error calculating ride fare", error: error.message });
  }
}

async function createRide(req, res) {
  try {
    const { pickup, drop, vehicleType, assignedDriverId, userId } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({ message: "Pickup and drop locations are required" });
    }

    const finalUserId = req.user.id;

    const createdRide = await createRideAndGenerateSlip({
      userId: finalUserId,
      pickup,
      drop,
      vehicleType,
      assignedDriverId,
    });

    const io = getIO();

    const onlinePilots = await Rider.find({ isAvailable: true, socketId: { $ne: null } });

    onlinePilots.forEach((pilot) => {
      io.to(pilot.socketId).emit("new_ride_request", {
        rideId: createdRide._id,
        pickup: createdRide.pickup,
        drop: createdRide.drop,
        fare: createdRide.fare,
        vehicleType: createdRide.vehicleType,
        userId: createdRide.userId,
      });
    });

    console.log(`Ride ${createdRide._id} sent to ${onlinePilots.length} pilots`);

    return res.status(201).json({ message: "Ride created & request sent to pilots", ride: createdRide });

  } catch (error) {
      console.error("Ride creation error:", error.message);
    return res.status(500).json({
      message: "Error creating ride",
      error: error.message
    });
  }
}


module.exports = {
  calculateRideFare,
  createRide,
};
