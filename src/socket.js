const { Server } = require("socket.io");
const Ride = require("./schema/rideSchema");
const Rider = require("./schema/riderSchema");

let io;
let onlinePilots = {};
let onlineUsers = {};

function initSocket(server) {
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  console.log("Socket.IO Initialized");

  io.on("connection", (socket) => {
    console.log("Client Connected:", socket.id);

    socket.on("user_join", (userId) => {
      if (!userId) return;

      const uid = userId.toString();
      onlineUsers[uid] = socket.id;

      console.log("User Joined:", uid, "socket:", socket.id);
      console.log("onlineUsers:", onlineUsers);
    });

    socket.on("pilot_online", async (pilotId) => {
      if (!pilotId) return;

      onlinePilots[pilotId] = socket.id;

      await Rider.findByIdAndUpdate(pilotId, {
        isAvailable: true,
        socketId: socket.id,
      });

      console.log("Pilot Online:", pilotId, "socket:", socket.id);
    });

    socket.on("pilot_offline", async (pilotId) => {
      if (!pilotId) return;

      delete onlinePilots[pilotId];

      await Rider.findByIdAndUpdate(pilotId, {
        isAvailable: false,
        socketId: null,
      });

      console.log("Pilot Offline:", pilotId);
    });

    socket.on("pilot_accept", async ({ rideId, pilotId }) => {
      try {
        if (!rideId || !pilotId) return;

        const ride = await Ride.findOneAndUpdate(
          { _id: rideId, status: "created" },
          { status: "assigned", driverId: pilotId },
          { new: true }
        );
        console.log("onlineUsers at accept:", onlineUsers);

        if (!ride) {
          console.log("Ride already taken:", rideId);
          return;
        }

        const pilot = await Rider.findById(pilotId).select(
          "fullName phoneNumber vehicleType"
        );
        const rides = await Ride.findById(rideId);

        const userId = ride.userId?.toString();
        const userSocketId = onlineUsers[userId];

        console.log("Ride assigned:", rideId);

        if (userSocketId) {
          io.to(userSocketId).emit("ride_accepted", {
            rideId,
            status: "accepted",
            pilot: {
              id: pilot._id,
              name: pilot.fullName,
              phone: pilot.phoneNumber,
              vehicleType: rides.vehicleType,
            },
          });

          console.log("ride_accepted sent to user:", userId);
        } else {
          console.log("User not online:", userId);
        }

        for (let pid in onlinePilots) {
          if (pid !== pilotId) {
            io.to(onlinePilots[pid]).emit("ride_taken", rideId);
          }
        }
      } catch (err) {
        console.error("pilot_accept error:", err);
      }
    });

    socket.on("pilot_reject", ({ rideId, pilotId }) => {
      console.log(`Pilot ${pilotId} rejected ride ${rideId}`);
    });

    socket.on("pilot_location", async ({ pilotId, lat, lng }) => {
      if (!pilotId) return;

      await Rider.findByIdAndUpdate(pilotId, {
        currentLocation: { lat, lng },
      });

      const activeRide = await Ride.findOne({
        driverId: pilotId,
        status: { $in: ["assigned", "on_trip"] },
      });

      if (activeRide) {
        const userId = activeRide.userId?.toString();
        const userSocketId = onlineUsers[userId];

        if (userSocketId) {
          io.to(userSocketId).emit("pilot_live_location", { lat, lng });
        }
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client Disconnected:", socket.id);

      for (let pilotId in onlinePilots) {
        if (onlinePilots[pilotId] === socket.id) {
          delete onlinePilots[pilotId];

          await Rider.findByIdAndUpdate(pilotId, {
            isAvailable: false,
            socketId: null,
          });

          console.log("Pilot Offline (disconnect):", pilotId);
        }
      }

      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          console.log("User Offline (disconnect):", userId);
        }
      }
    });
  });
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
