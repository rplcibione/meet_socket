const Express = require("express");
const Http = require("http");
const Socket = require("socket.io");

const app = Express();

const server = Http.createServer();

const io = Socket(server);

io.on("connect", (socket) => {
  socket.registeredRooms = [];
  console.log("Socket ", socket.id, " Connected");
  socket.on("test", (_) => console.log("Test from " + socket.id));
  socket.on("join", (room) => {
    socket.join(room);
    socket.registeredRooms.push(room);
  });
  socket.on("update_location", (data) => {
    console.log("Location update coming form " + data);
    socket.registeredRooms.forEach((room) => {
      console.log("Broadcasting to room " + room);
      io.to(room).emit("location_updates", data);
    });
  });
});

server.listen(process.env.PORT || 80, (_) => {
  console.log("Server Started");
});
