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
    socket.join(room);
    if (socket.registeredRooms.indexOf(room) == -1)
      socket.registeredRooms.push(room);

    socket.emit("sys_notif", `You are joining room ${room}`);
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
    try {
      if (typeof data == "string") data = JSON.parse(data);
      const { roomId, chatInfo } = data;
      console.log(roomId);
      console.log(chatInfo);
      console.log("Sending to room" + roomId);
      io.to(roomId).emit("chat", chatInfo);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("send_message_broadcast", (data) => {
    console.log(data);
    try {
      if (typeof data == "string") data = JSON.parse(data);
      const { chatInfo } = data;
      console.log(roomId);
      console.log(chatInfo);
      console.log("Sending to room" + roomId);
      io.emit("chat", chatInfo);
    } catch (error) {
      console.log(error);
    }
  });
});

server.listen(process.env.PORT || 80, (_) => {
  console.log("Server Started");
});
