import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { Box, Grid, Stack } from '@mui/system'
import { TextField } from '@mui/material'
import socketIOClient from "socket.io-client"
import Peer from 'peerjs'
import { v4 as uuidv4 } from 'uuid'

export default function Video() {


    // socket instance
    // const socket = socketIOClient(`https://study-room-server.onrender.com`, {secure: false});
    const socket = socketIOClient(`http://localhost:3001`);
    const router = useRouter()
    const user_info = router.query
    const [userID, setUserId] = useState(`${uuidv4()}`);
    const peer = new Peer(userID);

    useEffect(() => {
        // Our path: http://localhost:3000/videos/meeting?name=Aryan+Patel&id=191952
        console.log(user_info)
        socket.emit("info", user_info)
    }, [])

    useEffect(() => {
        socket.emit('video-call', {
            roomID: user_info['id'], 
            userID: userID
        })
    }, [])

    // messages states
    const [curMsg, setCurMsg] = useState("")
    const [sent, setSent] = useState("false")
    const [textMessages, setTextMessages] = useState([
        {
            name: "Bot1",
            msg: "Hello Bot2!"
        },
        {
            name: "Bot2",
            msg: "Hello Bot1!"
        }
    ]);
    // video
    const [remoteStreams, setRemoteStreams] = useState({});
    useEffect(() => {
        // Check Peer is on, if not it is not connected to the server and dataConnection won't transport mediaStream
        peer.on('open',id => {
            console.log("Peer is open");
            console.log(id);
        });

        socket.on('userID', data => {
            if (data[`userID`] != userID) {

                navigator.mediaDevices.getUserMedia({video: true, audio: true})
                .then(stream => {
                    console.log(`Calling user: ${data[`userID`]}`)
                    const call = peer.call(data["userID"], stream);
                    call.on('stream', stream => {
                        addFriendStream(call.peer, stream);
                    })
                })
            }
        });

        peer.on('call', call => {
            console.log(`Getting call from user: ${call.peer}`)

            navigator.mediaDevices.getUserMedia({video: true, audio: true})
            .then(stream => {
                call.answer(stream);
            })
            call.on('stream', stream => {
                addFriendStream(call.peer, stream);
            })
        });

      }, [userID]);

    // helper method to append new friendStream to remoteStreams state
    const addFriendStream = (friendID, friendStream) => {
        const remoteStreamsCopy = remoteStreams;
        remoteStreamsCopy[friendID] = friendStream;
        setRemoteStreams(Object.assign({}, remoteStreamsCopy));
    }

    const submitMsg = (e) => {
        if (e.keyCode == 13 && e.target.value != "") {
            setSent("true")
            console.log(e.target.value)
        }
    }

    // Run whenever sent is true
    useEffect(() => {
        if (sent === "true") {
            // Prepare to send message to all other in the room
            socket.emit("send_message", {
                name: user_info['name'],
                msg: curMsg,
                id: user_info['id']
            })
            console.log("I am sending message" + curMsg)
        }

        // Retrieve message from other individuals
        socket.on("from_message", (incomingMsg) => {
            console.log("I am getting an message" + incomingMsg['msg'])
            const newTextMessagesArray = textMessages
            newTextMessagesArray.push(incomingMsg)
            setTextMessages([...newTextMessagesArray])
        })
        setCurMsg("")
        setSent("false")

    }, [sent])

    return (
        <>
        <Head><title>Meeting Room</title></Head>
        <div className='videoPage'>
            <div className="leftHalf">
                {Object.keys(remoteStreams).map((curr, ind) => {
                    const currStream = remoteStreams[curr];
                    return <VideoPlaceHolder stream={currStream} key={ind} />
                })}
            </div>
            <div className="rightHalf">
                <Stack spacing={1} className="chatStack">
                    {textMessages.map((cur, ind) => {
                        return (
                            <TextBubble key={ind} msg={cur['msg']} name={cur['name']}/>
                        )
                    })}
                    <Stack spacing={10} className="bottomStack">
                        <div></div>
                        <TextField
                            label="Enter your message here"
                            type="Outlined"
                            autoComplete="current-password"
                            className='chatBar'
                            value={curMsg}
                            onChange={e=>{setCurMsg(e.target.value)}}
                            onKeyDown={e => {submitMsg(e)}}
                        />
                    </Stack>
                </Stack>
            </div>
        </div>
        </>
    )
}

const TextBubble = (props) => {
    return (
        <Box className={`TextMessageBox ${props.col == 1 ? "msgMe" : "msgThem"}`}>
            {props.name}: {props.msg}
        </Box>
    )
}

const VideoPlaceHolder  = (props) => {

    const vidRef = useRef(undefined);
    useEffect(() => {
      vidRef.current.srcObject = props.stream;
      vidRef.current.addEventListener("loadedmetadata", () => {
        vidRef.current.play();
      });
    }, [vidRef.current])
  
    return(
        <video className ="videoBox" ref = {vidRef}>

        </video>
            
    )
}





