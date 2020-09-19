import React, { createContext, useState, useEffect, useMemo } from "react"
import { auth } from "../api/user"
import { createSocket } from "../api/"

export const UserContext = createContext(null)

export default function UserProvider ({ children }) {

    const [ user, setUser ] = useState('')
    const [ isLoggedIn, setLoggedIn ] = useState(Boolean(user))

    const socket = useMemo(()=>{
        if(!user){ return null }
        return createSocket({query: { user } })
    },[user])

    useEffect(()=>{
        auth()
        .then((data)=>{

            setUser(data.data)
            setLoggedIn(true)
        })
        .catch(e=>setLoggedIn(false))
    },[isLoggedIn])

    return (
        <UserContext.Provider value={{socket,user,setUser,isLoggedIn}}>{children}</UserContext.Provider>
    )
}
