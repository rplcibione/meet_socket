const io = require("socket.io-client");

const socket1 = io("http://localhost:6500");
const socket2 = io("http://localhost:6500");
const socket3 = io("http://localhost:6500");

socket1.emit("join", "room1");
socket2.emit("join", "room1");
socket3.emit("join", "room1");

socket1.on("location_updates", (socketname) => {
  console.log("Location update from socket " + socketname);
});

socket2.emit("update_location", "socket2");
socket3.emit("update_location", "socket3");
