
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
});

const SlipItemSchema = new mongoose.Schema({
  key: String,
  value: mongoose.Schema.Types.Mixed,
});

const RideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, 
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider', default: null },

  pickup: { type: LocationSchema, required: true },
  drop: { type: LocationSchema, required: true },

  distance_km: { type: Number },
  distance_text: { type: String },
  duration_text: { type: String },

  vehicleType: { type: String, enum: ['bike','car','auto'], default: 'bike' },

  fare: { type: Number, required: true },

  status: { 
    type: String,
    enum: ['created','assigned','accepted','on_trip','completed','cancelled'],
    default: 'created'
  },

  slip: {
    slipId: { type: String },
    items: [SlipItemSchema],
    generatedAt: { type: Date }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

RideSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ride', RideSchema);
