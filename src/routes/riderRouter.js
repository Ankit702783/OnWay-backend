const {registerNewRider,
    getRiderDetails} = require('../controller/riderController');

const express = require('express');
const riderRouter = express.Router();

riderRouter.post('/register', registerNewRider);
riderRouter.get('/:id', getRiderDetails);

module.exports = riderRouter;