const { getRideEstimate } = require('../services/rideService');

 async function calculateRideFare (req, res){
  try {
    const { pickup, drop } = req.body;

    if (!pickup || !drop)
      return res.status(400).json({ message: "Pickup and drop locations are required" });

    const rideData = await getRideEstimate(pickup, drop);
    return res.status(200).json(rideData);

  } catch (error) {
    console.error("❌ Ride calculation error:", error.message);
    return res.status(500).json({ message: "Error calculating ride fare", error: error.message });
  }
};

module.exports={
  calculateRideFare
};
