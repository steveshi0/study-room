import React from 'react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Box, Grid, Stack } from '@mui/system'
import { TextField } from '@mui/material'

export default function Video() {
    const router = useRouter()
    // const id = router.query.video

    const [curMsg, setCurMsg] = useState("Type your message here");

    const [textMessages, setTextMessages] = useState([
        {
            msg: "Hello There!",
            from: 1
        },
        {
            msg: "Hello Steve!",
            from: 0
        },
        {
            msg: "Hello There!",
            from: 1
        },
        {
            msg: "Hello Steve!",
            from: 1
        }
    ]);

    const submitMsg = (e) => {
        if (e.keyCode != 13)
            return
        console.log(e.target.value)
        textMessages.push({
            msg: e.target.value,
            from: 1
        })
        setCurMsg("Type your message here")
        console.log(textMessages)
    }

    return (
        <div className='videoPage'>
            <div className="leftHalf">
                Hello Steve
            </div>
            <div className="rightHalf">
                <Stack spacing={1} className="chatStack">
                    {textMessages.map((cur, ind) => {
                        return (
                            <TextBubble key={ind} msg={cur['msg']} col={cur['from']} />
                        )
                    })}
                    <Stack spacing={10} className="bottomStack">
                        <div></div>
                        <TextField
                        label=""
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
    )
}

const TextBubble = (props) => {
    return (
        <Box className={`TextMessageBox ${props.col == 1 ? "msgMe" : "msgThem"}`}>
            {props.msg}
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