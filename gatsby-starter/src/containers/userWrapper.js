import React, { useState, useEffect } from "react"
import SocketContainer from "./socketCont"


export default function userWrapper (props) {
  
  let username = props.user.name

  useEffect(()=>{
    console.log(username, "did i change?")
  },[username])

  return(<div></div>)
}