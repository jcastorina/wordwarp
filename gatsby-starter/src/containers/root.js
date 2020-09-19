import React, { useContext } from "react"
import { register } from "../api/user"
import Home from '../components/home'
import FadeIn from '../components/fadeIn'
import Login from "../components/Login"
import { UserContext } from "../contexts/user"

export default function Root () {

    const userContext = useContext(UserContext)

    return (
        <FadeIn>         
            {userContext.isLoggedIn
            ?<Home />           
            :<Login onSuccess={({username})=>{userContext.setUser({ name: username })}}/>}
        </FadeIn>
    )
}

function handleRegister (o,setRegToggle, setLoggedIn) {
    register(o)
    .then(() =>{
    
        setLoggedIn(true)
    })
    .catch(()=>{console.error("failed")})
}