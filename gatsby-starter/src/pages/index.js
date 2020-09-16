import React, { useState, useEffect } from "react"
import axios from 'axios'
import Home from '../components/home'

const uri = "http://127.0.0.1:4000"


function register (o,setRegToggle, setLoggedIn) {

    axios.post(uri + "/register", o, {withCredentials: true})
    .then(data =>{
        console.log(data)
        setRegToggle(false)
        setLoggedIn(true)
    })
    .catch((e)=>{
        console.error("failed")
        setRegToggle(false)
    })
}

function logout (setLoggedIn,setUser) {

    axios.delete(uri + "/logout", {withCredentials: true})
    .then(data => {
        console.log(data)
        setLoggedIn(false)
        setUser({})
    })
}

function submit (o,setRegToggle, setLoggedIn) {

    axios.post(uri + '/submit', o, {withCredentials:true})
    .then(({ data }) => {
        if(data === "no username"){
            console.log("wanna register?")
            setRegToggle(true)
         
        }
        if(data === "logged in"){
            console.log("very cool!")
            setRegToggle(false)
            setLoggedIn(true)
        }
    })
    .catch((e)=>{
        console.log("no server",e)
    })
}

let headerStyle = {
    backgroundColor: 'black',
    color: 'turquoise',
    height: '2em',
    padding: '0em',
    margin: '0em',
    border: '0em',
    width: '100%',
    textAlign: 'center'
  }
  

export default function Login () {

    const [ isLoaded, setIsLoaded ] = useState(false)

    const [ isLoggedIn, setLoggedIn ] = useState(false)
    const [ user, setUser ] = useState({})
  
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')

    const [ regToggle, setRegToggle ] = useState(false)

    const userObject = {
        username: username,
        password: password,
    }

    useEffect(()=>{
   
      axios.get(uri + '/auth', {withCredentials: true})
      .then(result=>{
        setLoggedIn(result.data.status)
        setUser({
          name: result.data.user
        })
        setIsLoaded(true)
        
        console.log(result.data, "/auth ran")
      })
      .catch(err=>{
        setLoggedIn(false)
      })
    },[isLoggedIn])

    return (
        isLoaded ?
            <>      
                {isLoggedIn?
                <>
                <header css={headerStyle}>hi, {user.name}</header>
                    <Home 
                        user={user}
                    />
                    <button 
                        onClick={()=>{
                            logout(setLoggedIn,setUser)
                        }}
                    >LOGOUT</button>
                </>
                :
                    <>            
                        <button 
                            onClick={()=>submit(
                                    userObject,
                                    setRegToggle,
                                    setLoggedIn
                                )}
                        >Submit</button>

                        <br></br>

                        <input label="username"
                            onChange={(e)=>{
                                setUsername(e.target.value)
                            }}
                        />
                        <input label="password"
                            onChange={(e)=>{
                                setPassword(e.target.value)
                            }}
                        />
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
                    </>   
                }
            </>
        :
            <>LOADING...</>
    )
}