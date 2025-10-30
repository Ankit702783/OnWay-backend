const { registerRider,
  fetchRiderById,
  fetchRiderByPhoneNumber,
  modifyRiderById,
  removeRiderById,} = require('../services/riderService');

const registerNewRider = async (req, res) => {
    try {
        const riderDetails = req.body;
        const newRider = await registerRider(riderDetails);
        res.status(201).json(newRider);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register rider' });
    }
};

const getRiderDetails = async (req, res) => {
    try {
        const riderId = req.params.id;
        const rider = await fetchRiderById(riderId);
        if (!rider) {
            return res.status(404).json({ error: 'Rider not found' });
        }
        res.status(200).json(rider);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rider details' });
    }
};

const updateRiderCurrentLocation = async (req, res) => {
    try {
        const riderId = req.params.id;
        const { lat, lng } = req.body;
        const updatedRider = await updateRiderLocation(riderId, { currentLocation: { lat, lng } });
        if (!updatedRider) {
            return res.status(404).json({ error: 'Rider not found' });
        }
        res.status(200).json(updatedRider);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update rider location' });
    }
};

module.exports = {
    registerNewRider,
    getRiderDetails,
    updateRiderCurrentLocation,
};  