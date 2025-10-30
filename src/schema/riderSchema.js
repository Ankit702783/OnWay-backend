const mongoose = require("mongoose");

const riderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String },
  profilePic: { type: String },

  vehicleType: { type: String, required: true },
  vehicleModel: { type: String },
  vehicleNumber: { type: String, required: true },
  licenseNumber: { type: String },
  rcBookPhoto: { type: String },
  licensePhoto: { type: String },

  address: { type: String },
  city: { type: String },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
  },
  isAvailable: { type: Boolean, default: false },

  walletBalance: { type: Number, default: 0 },
  totalRides: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  bankAccount: {
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
  },

  isVerified: { type: Boolean, default: false },
  documentsVerified: { type: Boolean, default: false },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, default: "pending" },
});

module.exports = mongoose.model("Rider", riderSchema);
