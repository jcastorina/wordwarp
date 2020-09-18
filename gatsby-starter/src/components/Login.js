import React, { useState, useEffect } from "react"
import { TextField } from '@material-ui/core'
import { login } from "../api/user"
import FadeIn from './fadeIn'
import FadeOut from './fadeOut'

export default function Login ({ onSuccess }) {

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ submitMessageToggle, setSubmitMessageToggle] = useState(false)
    const [ initSubmitMessage, setInitSubmitMessage ] = useState(false)

    useEffect(()=>{
        const isComplete = username&&password
        setSubmitMessageToggle(isComplete)
    },[username,password])

    useEffect(()=>{
        if(submitMessageToggle){setInitSubmitMessage(true)}
    },[submitMessageToggle])

    function handleLogin (e) {
        if(e.key === 'Enter'){
            const user = { username, password }
            console.log(user,"login creds")
            login(user)
            .then(() => {
                onSuccess({ username })
            })
            .catch(()=>{console.log("failed to login")})   
        }
    }

    return (
        <div css={loginStyle}>            
        <TextField 
            color="primary" 
            style={inputStyle}
            variant="standard" 
            label="name"  
            onChange={(e)=>{setUsername(e.target.value)}}
            onKeyPress={(e)=>{handleLogin(e,username,password)}}/>
        <TextField 
            color="primary" 
            style={inputStyle} 
            variant="standard" 
            label="password" 
            type="password" 
            onChange={(e)=>{setPassword(e.target.value)}}
            onKeyPress={(e)=>{handleLogin(e,username,password)}}/>
        <div style={{...inputStyle, height: "1em", paddingTop: '8px'}}>
            {initSubmitMessage?submitMessageToggle?
            <FadeIn>Press ENTER to Submit</FadeIn>
            :<FadeOut>Press ENTER to Submit</FadeOut>:null}
        </div>
    </div>   
    )
}

const loginStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '32em',
}

const inputStyle = { margin: '8px' }