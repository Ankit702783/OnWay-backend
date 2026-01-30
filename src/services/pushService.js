const webpush = require("../push/push");

async function sendRideNotification(pilot, ride) {
  if (!pilot.pushSubscription) return;

  const payload = JSON.stringify({
    title: "🚨 New Ride Request",
    body: `Pickup: ${ride.pickup.address}`,
    url: "/dashboard"
  });

  try {
    await webpush.sendNotification(
      pilot.pushSubscription,
      payload
    );
  } catch (err) {
    console.error("Push failed:", err.message);
  }
}

module.exports = { sendRideNotification };
