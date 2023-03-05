import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Box, Grid, Stack } from '@mui/system'
import { TextField } from '@mui/material'
import socketIOClient from "socket.io-client"


export default function Video() {

    // socket instance
    const socket = socketIOClient(`https://study-room-server.onrender.com`, {secure: false});
    const router = useRouter()
    const user_info = router.query

    useEffect(() => {
        // Our path: http://localhost:3000/videos/meeting?name=Aryan+Patel&id=191952
        console.log(user_info)
        socket.emit("info", user_info)
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

/*
const TextBubble2 = (props) => {

    const [age, setAge] = useState(15)

    useEffect(() => {
        console.log(`New age is ${age}`)
    }, [age])

    
    return (
        <div>
            <button onClick={e => {
                setAge(Math.random(10))
            }}>AGE</button> 
            {props.aryan}
            <br />
            {props.anvith}
        </div>
    )
}
*/