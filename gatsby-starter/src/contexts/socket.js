import React, { createContext, useState, useEffect } from "react"
import { socket } from "../api/"

export const SocketContext = createContext(null)

export default function SocketProvider ({ children }) {

    const _socket = socket({query: 
        { user: props }
    })

    return (
        <SocketContext.Provider value={{socket:_socket}}>{children}</SocketContext.Provider>
    )
}
