const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors'); 
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.get('/', (req, res) => {
  res.send('<h1>Steve is Eating, Steve is sleeping, Steve is repeating</h1>');
})

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
  

io.on('connection', (socket) => {
  console.log('a user connected to room');

  // Join the user to roomID
  socket.on("info", (data) => {
    console.log(data)
    socket.join(data.id)
  })

  // Receiving messages from clients
  socket.on("send_message", (data) => {
    console.log(data)
    io.in(data['id']).emit("from_message", data)
  })

  socket.on('disconnect', (socket) => {
    console.log(`A disconnected user`)
  })

  // Send the uuid 
  socket.on("video-call", (data) => {
    console.log(data)
    console.log('Received a new uuid for video call')
    io.in(data['roomID']).emit('userID', data)
  })
});



server.listen(3001, () => {
  console.log('listening on *:3001');
});