import socketIOClient from "socket.io-client";
import React from "react";

const socket = socketIOClient(`localhost:3001`, {secure: false});

export default function test() {
    return (
        <h1>
            <title>Create Next App</title>
        </h1>
    )
  
}