// socket.js
const { Server } = require("socket.io");

let io;
let onlinePilots = {};   // pilotId -> socketId
let onlineUsers = {};    // userId  -> socketId

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  console.log("⚡ Socket.IO Initialized");

  io.on("connection", (socket) => {

    console.log("🔥 Client Connected:", socket.id);

    // =====================================================
    // 1️⃣ USER JOIN SOCKET
    // =====================================================
    socket.on("user_join", (userId) => {
      onlineUsers[userId] = socket.id;
      socket.join(`user_${userId}`);   // Joining room for user
      console.log(`🟢 User Joined Room: user_${userId}`);
    });


    // =====================================================
    // 2️⃣ PILOT ONLINE
    // =====================================================
    socket.on("pilot_online", (pilotId) => {
      onlinePilots[pilotId] = socket.id;
      socket.join(`driver_${pilotId}`);   // Room for driver
      console.log(`🟢 Pilot Online: driver_${pilotId}`);
    });


    // =====================================================
    // 3️⃣ PILOT ACCEPT RIDE
    // =====================================================
    socket.on("pilot_accept", async ({ rideId, pilotId, userId }) => {
      console.log("🚖 Pilot Accepted Ride:", rideId);

      // Notify User
      io.to(`user_${userId}`).emit("ride_accepted", {
        rideId,
        pilotId,
        status: "accepted"
      });
    });


    // =====================================================
    // 4️⃣ PILOT REJECT RIDE
    // =====================================================
    socket.on("pilot_reject", async ({ rideId, pilotId, userId }) => {
      console.log("❌ Pilot Rejected Ride:", rideId);

      // Notify User
      io.to(`user_${userId}`).emit("ride_rejected", {
        rideId,
        pilotId,
        status: "rejected"
      });
    });


    // =====================================================
    // 5️⃣ PILOT LIVE LOCATION
    // =====================================================
    socket.on("pilot_location", ({ userId, lat, lng }) => {
      io.to(`user_${userId}`).emit("pilot_live_location", { lat, lng });
    });


    // =====================================================
    // 6️⃣ DISCONNECT LOGIC
    // =====================================================
    socket.on("disconnect", () => {
      console.log("❌ Client Disconnected:", socket.id);

      // Remove pilot if disconnected
      for (let id in onlinePilots) {
        if (onlinePilots[id] === socket.id) {
          delete onlinePilots[id];
          console.log(`🔴 Pilot Offline: ${id}`);
        }
      }

      // Remove user if disconnected
      for (let id in onlineUsers) {
        if (onlineUsers[id] === socket.id) {
          delete onlineUsers[id];
          console.log(`🔴 User Offline: ${id}`);
        }
      }
    });
  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
