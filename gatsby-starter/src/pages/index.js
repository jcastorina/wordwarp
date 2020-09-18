import React, { useState, useEffect } from "react"
import { register, auth } from "../api/user"
import "../styles/app.css"
import Home from '../components/home'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import FadeIn from '../components/fadeIn'
import Login from "../components/Login"


export default function Root () {

    const [ user, setUser ] = useState({})
    const isLoggedIn = Boolean(user)

    const userObject = {
        user: user,
        setUser: setUser,
    }

    return (
        <MuiThemeProvider theme={siteTheme}>
            <FadeIn>         
                {isLoggedIn?                           
                    <Home props={userObject}/>           
                :
                    <Login onSuccess={({username})=>{
                        setUser({ name: username })        
                    }}/>
                }
            </FadeIn>
        </MuiThemeProvider>
    )
}

function handleRegister (o,setRegToggle, setLoggedIn) {
    register(o)
    .then(() =>{
    
        setLoggedIn(true)
    })
    .catch(()=>{console.error("failed")})
}

const siteTheme = createMuiTheme({
    palette: {
      primary: {
          main: "hsla(0,0%,0%,0.8)"
      },
      secondary: {
        main: 'rgb(255, 105, 180)'
      },
    },
})
