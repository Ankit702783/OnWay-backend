const webpush = require("./push");

async function notifyPilot(pilot, ride) {
  if (!pilot.pushSubscription) {
    console.log("⚠️ Pilot has no push subscription");
    return;
  }

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

    console.log("✅ Push sent to pilot:", pilot._id);
  } catch (err) {
    console.error("❌ Push failed:", err.message);
  }
}

module.exports = notifyPilot;
