import React from "react"
import Button from "./button"
import { logout } from "../api/user"

export default function Header ( props ) {
    console.log(props,"header")
   
    return ( 
     
    <header css={headerStyle}>{props.user?headline.loggedIn+props.user.name:headline.notLoggedIn}<Button onClick={()=>{handleLogout(props)}}>LOGOUT</Button></header>
    
        )
}

async function handleLogout (props) {
    try {
        await logout()
        props.setUser(null)
        props.socketLogout()
    }
    catch (e) {
        console.error(e)
    }
}

const headline = {
    loggedIn: "Hi, ",
    notLoggedIn: "Do I know you?"
}

const headerStyle = {
    backgroundColor: 'black',
    color: 'turquoise',
    height: '2em',
    padding: '0em',
    margin: '0em',
    border: '0em',
    width: '100%',
    textAlign: 'center',
    display: ""
  }
  