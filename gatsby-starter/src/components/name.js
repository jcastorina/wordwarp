import React from "react"

export default function name({ props, setModalProps, style }){
    
    return (
        <div
            role="none"
            css={style}
            onClick={()=>{
                setModalProps({
                    open: true,
                    type: false,
                    name: props.entryName, 
                    votes: props.totalVotes, 
                    id: props.id,
                    submissions: props.submissions
                })
            }}
        >{props.entryName}</div>
    )
}
