import React, { useState, useEffect } from "react"
import axios from 'axios'
import "../styles/app.css"
import Home from '../components/home'
import { TextField, Fade } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import FadeIn from '../components/fadeIn'
import FadeOut from '../components/fadeOut'

export default function Login () {

    const [ isLoaded, setIsLoaded ] = useState(false)
    const [ isLoggedIn, setLoggedIn ] = useState(false)
    const [ user, setUser ] = useState({})
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ regToggle, setRegToggle ] = useState(false)
    const [ submitMessageToggle, setSubmitMessageToggle] = useState(false)
    const [ initSubmitMessage, setInitSubmitMessage ] = useState(false)

    const userObject = {
        username: username,
        password: password,
        setUsername: setUsername,
        setPassword: setPassword,
        setUser: setUser,
        setRegToggle: setRegToggle,
        setLoggedIn: setLoggedIn,
        setInitSubmitMessage: setInitSubmitMessage
    }

    useEffect(()=>{
      axios.get(uri + '/auth', {withCredentials: true})
      .then(result=>{
        setLoggedIn(result.data.status)
        setUser({name: result.data.user})
        setIsLoaded(true)  
        console.log(result.data, "/auth ran")
      })
      .catch(err=>{setLoggedIn(false)})
    },[isLoggedIn])

    useEffect(()=>{
        if(username&&password){ setSubmitMessageToggle(true); setInitSubmitMessage(true) }
        if(!username&&!password){ setSubmitMessageToggle(false) }
    },[username,password])
    
    return (
        <MuiThemeProvider theme={siteTheme}>
            <FadeIn>
            {isLoaded?
            <>      
                {isLoggedIn?
                <>                  
                    <Home user={user}/>
                    <button onClick={()=>{logout(userObject)}}>LOGOUT</button>
                </>
                :
                <div css={loginStyle}>            
                    <TextField 
                        color="primary" 
                        style={inputStyle}
                        variant="standard" 
                        label="name"  
                        onChange={(e)=>{setUsername(e.target.value)}}
                        onKeyPress={(e)=>{checkIfEnter(e,userObject)}}/>
                    <TextField 
                        color="primary" 
                        style={inputStyle} 
                        variant="standard" 
                        label="password" 
                        type="password" 
                        onChange={(e)=>{setPassword(e.target.value)}}
                        onKeyPress={(e)=>{checkIfEnter(e,userObject)}}/>
                    <div style={{...inputStyle, height: "1em", paddingTop: '8px'}}>
                        {initSubmitMessage?submitMessageToggle?
                        <FadeIn>Press ENTER to Submit</FadeIn>
                        :<FadeOut>Press ENTER to Submit</FadeOut>:null}
                    </div>
                    {regToggle?
                        <button onClick={()=>{
                            register(
                                userObject,
                                setRegToggle,
                                setLoggedIn
                            )
                        }}>
                            Register
                        </button>
                    :
                    null}
                </div>   
                }
            </>
            :
            <></>//Landing page loading message goes here
            }
            </FadeIn>
        </MuiThemeProvider>
    )
}

const uri = "http://127.0.0.1:4000"

function register (o,setRegToggle, setLoggedIn) {
    axios.post(uri + "/register", o, {withCredentials: true})
    .then(data =>{
        console.log(data)
        setRegToggle(false)
        setLoggedIn(true)
    })
    .catch((e)=>{console.error("failed");setRegToggle(false)})
}

function logout (o) {
    axios.delete(uri + "/logout", {withCredentials: true})
    .then(data => {
        console.log(data)
        //clear everything out and restart from fresh login (hopefully)
        o.setLoggedIn(false)
        o.setUser({})
        o.setInitSubmitMessage(false)
        o.setUsername("")
        o.setPassword("")
    })
}

function checkIfEnter (e,o) {
    if(e.key === 'Enter'){
        const user = { username: o.username, password: o.password }
        axios.post(uri + '/submit', user, {withCredentials:true})
        .then(({ data }) => {
            if(data === "no username"){
                console.log("wanna register?")
                o.setRegToggle(true)   
            }
            if(data === "logged in"){
                console.log("very cool!")
                o.setRegToggle(false)
                o.setLoggedIn(true)
            }
        })
        .catch((e)=>{console.log("no server",e)})   
    }
}

const loginStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '32em',
}

const inputStyle = { margin: '8px' }

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
