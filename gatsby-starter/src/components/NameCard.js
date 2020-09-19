import React from "react"

export default function name({ props, modalCtrl }){
 
    return (
        <div
            role="none"
            css={nameStyle}
            onClick={()=>{
                modalCtrl({
                    open: true,
                    type: false,
                    name: props.entryName, 
                    votes: props.totalVotes, 
                    id: props.id,
                    submissions: props.submissions
                })
            }}>{props.entryName}</div>
    )
}

const nameStyle = {
    backgroundColor: 'white',
    padding: '2em',
    width: '40em',
    '&:hover': {
      color: 'hotpink',
      cursor: 'pointer'
    }
}