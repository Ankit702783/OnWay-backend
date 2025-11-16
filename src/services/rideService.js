const axios=require('axios');
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;


const FARE_RATES = {
  bike: 8,
  auto: 12,
  car: 18,
};

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
   

    const bikefare=Math.round(baseFare + distanceValue * 3);
    const carfare=Math.round(baseFare + distanceValue * 9);
    const autofare=Math.round(baseFare + distanceValue * 2);

    return {
      pickup,
      drop,
      
      distance: distanceText,
      duration: durationText,
     
      bikefare,
      carfare,
      autofare
    };
  } catch (error) {
    console.error("Distance API error:", error.message);
    throw error;
  }
};

module.exports={
  getRideEstimate
};