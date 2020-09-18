import React from "react"
import Name from "./NameCard"

export default function NameWrapper (props) {

    return ( 
        props.messages.map(message=>{
            return  <Name 
                        key={message.id} 
                        props={message}          
                        modalCtrl={props.modalCtrl}/>
                       
        })
    )
}
