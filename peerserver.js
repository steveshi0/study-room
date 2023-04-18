const { PeerServer } = require("peer");

// Custom Peer Server, only work locally
const peerServer = PeerServer({ port: 9000, path: "/elvin" });