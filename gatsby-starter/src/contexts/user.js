import { createContext, useState } from "react"

const UserContext = createContext()

function UserProvider () {

    const [ user, setUser ] = useState()
    

    return (
        <UserContext.Provider value={}></UserContext.Provider>
    )
}
