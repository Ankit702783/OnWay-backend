const Rider = require("../schema/riderSchema");

async function savePushSubscription(req, res) {
  const pilotId = req.user.id;

  await Rider.findByIdAndUpdate(pilotId, {
    pushSubscription: req.body
  });

  res.json({ success: true });
}

module.exports = { savePushSubscription };
