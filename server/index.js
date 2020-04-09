const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
//creating an io instance
const io = socketio(server);
//pass in a socket that will be connected as a client side socket
io.on("connection", (socket) => {
  console.log("New connection!");

  socket.on("join", ({ name, room }, callback) => {
    //addUser receives id, name, and room
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `Welcome to ${user.room}, ${user.name}!`,
    });

    //lets everyone else know that the user has joined (besides that user )
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });

    socket.join(user.room);

    callback();
  });

  socket.on("sendMesage", (message, callback) => {
    const user = getUser(socket.id);
    //message is coming from the front end
    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    console.log("User has left.");
  });
});

//calling router as a middleware
app.use(router);

server.listen(PORT, console.log(`Server listening on port ${PORT}`));
