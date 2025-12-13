const { getRideEstimate, createRideAndGenerateSlip } = require('../services/rideService');

async function calculateRideFare(req, res) {
  try {
    const { pickup, drop } = req.body;

    if (!pickup || !drop)
      return res.status(400).json({ message: "Pickup and drop locations are required" });

    const rideData = await getRideEstimate(pickup, drop);
    return res.status(200).json(rideData);

  } catch (error) {
    console.error("❌ Ride calculation error:", error.message);
    return res.status(500).json({ 
      message: "Error calculating ride fare", 
      error: error.message 
    });
  }
}


async function createRide(req, res) {
  try {
    const { pickup, drop, vehicleType, assignedDriverId, userId } = req.body;

    if (!pickup || !drop) {
      return res.status(400).json({
        message: "Pickup and drop locations are required"
      });
    }

    // If your auth middleware sets req.user, use that
    const finalUserId = (req.user && req.user.id) || userId || null;

    const createdRide = await createRideAndGenerateSlip({
      userId: finalUserId,
      pickup,
      drop,
      vehicleType,
      assignedDriverId
    });

    return res.status(201).json({
      message: "Ride created & slip sent to pilot(s)",
      ride: createdRide
    });

  } catch (error) {
    console.error("❌ Ride creation error:", error.message);
    return res.status(500).json({
      message: "Error creating ride",
      error: error.message
    });
  }
}



// ==============================
// EXPORTS
// ==============================
module.exports = {
  calculateRideFare,
  createRide
};
