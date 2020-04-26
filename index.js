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
    console.log("Socket Joining Room " + room);
    socket.join("room" + room);
    if (socket.registeredRooms.indexOf("room" + room) == -1)
      socket.registeredRooms.push("room" + room);
  });
  socket.on("update_location", (data) => {
    console.log("Location update coming form " + data);
    socket.registeredRooms.forEach((room) => {
      console.log("Broadcasting to room " + room);
      io.to(room).emit("location_updates", data);
    });
  });
  socket.on("send_message", (data) => {
    console.log(data);
    const { roomId, chatInfo } = data;
    console.log(roomId);
    console.log(chatInfo);
    io.to("room" + roomId).emit("chat", chatInfo);
  });
});

server.listen(process.env.PORT || 80, (_) => {
  console.log("Server Started");
});
