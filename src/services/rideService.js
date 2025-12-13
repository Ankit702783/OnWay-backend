// rideService.js
const axios = require('axios');
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const { createRide, updateRide } = require('../repository/rideRepository');
const { getIO } = require('../socket');
const { v4: uuidv4 } = require('uuid');

const FARE_RATES = {
  bike: 8,
  auto: 12,
  car: 18,
};

// =======================
// ORIGINAL FUNCTION
// =======================
async function getRideEstimate(pickup, drop) {
  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      pickup
    )}&destinations=${encodeURIComponent(drop)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const { data } = await axios.get(url);

    if (data.status !== "OK" || !data.rows[0].elements[0].distance)
      throw new Error("Invalid location or unable to calculate distance");

    const distanceText = data.rows[0].elements[0].distance.text;
    const durationText = data.rows[0].elements[0].duration.text;
    const distanceValue = data.rows[0].elements[0].distance.value / 1000;

    const baseFare = 5;

    const bikefare = Math.round(baseFare + distanceValue * 3);
    const carfare = Math.round(baseFare + distanceValue * 9);
    const autofare = Math.round(baseFare + distanceValue * 2);

    return {
      pickup,
      drop,
      distance: distanceText,
      duration: durationText,
      bikefare,
      carfare,
      autofare,
      distance_km: distanceValue
    };
  } catch (error) {
    console.error("Distance API error:", error.message);
    throw error;
  }
}

// ===================================================
// NEW: CREATE RIDE + GENERATE SLIP + SEND TO PILOT
// ===================================================
async function createRideAndGenerateSlip({
  userId,
  pickup,
  drop,
  vehicleType = "bike",
  assignedDriverId = null
}) {
  // 1) First get the fare estimate (reuse your original logic)
  const estimate = await getRideEstimate(pickup, drop);

  let fare;
  if (vehicleType === "car") fare = estimate.carfare;
  else if (vehicleType === "auto") fare = estimate.autofare;
  else fare = estimate.bikefare;

  // 2) Build Ride Object for DB
  const rideObj = {
    userId: userId || null,
    driverId: assignedDriverId || null,

    pickup: { address: pickup },
    drop: { address: drop },

    distance_km: estimate.distance_km,
    distance_text: estimate.distance,
    duration_text: estimate.duration,

    fare,
    vehicleType,

    status: "created",

    slip: {
      slipId: uuidv4(),
      generatedAt: new Date(),
      items: [
        { key: "pickup", value: pickup },
        { key: "drop", value: drop },
        { key: "distance", value: estimate.distance },
        { key: "duration", value: estimate.duration },
        { key: "fare", value: fare },
        { key: "vehicle", value: vehicleType }
      ]
    }
  };

  // 3) Save Ride in DB
  const savedRide = await createRide(rideObj);

  // 4) Prepare slip payload for pilot
  const slipPayload = {
    rideId: savedRide._id,
    slipId: savedRide.slip.slipId,
    pickup,
    drop,
    distance: estimate.distance,
    duration: estimate.duration,
    fare,
    vehicleType,
    createdAt: savedRide.createdAt,
    userId: userId || null
  };

  // 5) Send slip to pilot via socket
  const io = getIO();

  if (assignedDriverId) {
    // send to only that driver (if you have rooms)
    io.to(`driver_${assignedDriverId}`).emit("new_ride_request", slipPayload);
  } else {
    // broadcast to all online pilots
    io.emit("new_ride_request", slipPayload);
  }

  return savedRide;
}

module.exports = {
  getRideEstimate,
  createRideAndGenerateSlip
};
