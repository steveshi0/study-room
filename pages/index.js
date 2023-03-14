import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import { TextField } from '@mui/material'
import { StudyRoomPicture } from '../public/StudyRoomPicture.png'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Study Room</title>
      
        
      </Head>
      <main className={styles.main}>
        <Intro />
      </main>
    </>
  )
}

const Intro = () => {
  const router = useRouter()

  // State variable to keep track of username & roomID
  // Whenever the state variable are changed the webpage i.e localhost:3000 will be re-rendered
  const [username, setUserName] = useState("Aryan")
  const [roomID, setRoomID] = useState(1)
  
  // username: Aryan Patel, roomid:   191952; When submit is clicked, reroute
  // FROM:  http://localhost:3000/
  // TO     http://localhost:3000/videos/meeting?name=Aryan+Patel&id=191952
  const handleSubmit = (e) => {
    console.log(`Now leaving main page, rerouting to video page`)
    router.push({
        pathname: '/videos/meeting',
        query: {  // query paramter we can make use of in [video].jsx
            name: username,
            id: roomID
        }
    })
  }

  return (
    <>
    <div>
        <Grid container spacing={5}>
          <Grid item xs={10} lg={10}>
            <TextField className='welcomeTxtField' label="Enter username here." variant="outlined" onChange={e => {
              setUserName(e.target.value)
            }} />
          </Grid>
          <Grid item xs={10} lg={10}>
            <TextField className='welcomeTxtField' label="Enter Room ID here." variant="outlined" onChange={e => {
              setRoomID(e.target.value)
            }} />
            </Grid>
          <Grid item xs={10} lg={10} className="welcomeBtnDiv">
            <Button variant="contained"
            sx = {{
              ":hover" : {
                bgcolor: "#222D8D",
                color: "dark blue"
              }
            }}
            className='welcomeBtn' onClick={(e) => {
              handleSubmit(e)
            }}>
              SUBMIT
            </Button>
          </Grid>
        </Grid>
    </div>
    <div>
      <img 
        src="./public/StudyRoomPicture.png"
        alt="Study Room" />
    </div>
    </>
  )
}