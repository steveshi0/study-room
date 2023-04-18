// const { PeerServer } = require("peer");

// // Custom Peer Server, only work locally
// const peerServer = PeerServer({ port: 9000, path: "/elvin" });


const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

app.get("/", (req, res, next) => res.send("Hello world!"));

// =======

const server = app.listen(3001);

const peerServer = ExpressPeerServer(server, {
	path: "/elvin",
});

app.use("/peerjs", peerServer);
