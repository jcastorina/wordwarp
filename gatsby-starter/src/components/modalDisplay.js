import React, { useRef } from 'react'
import { nameObj, charCompare } from "../utils/charCompare.js"
import TextField from "@material-ui/core/TextField"
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { css } from "@emotion/core"
import { rhythm } from "../utils/typography"


const hotpink = css({
    color: 'hotpink'
  })

const turquoise = css({
    color: 'turqoise'
})

const barTheme = createMuiTheme({
    palette: {
      primary: {
        main: 'rgb(64, 224, 208)'
      },
      secondary: {
        main: 'rgb(255, 105, 180)'
      },
    },
})

const entryStyles = css({
    '&:hover,&:focus': hotpink,
    'padding': `${rhythm(1)}`,
    'paddingBottom': `${rhythm(1.5)}`,
    'border': 'solid 1px #ccc',
    'borderRadius': '4px',
    'margin': `${rhythm(0.5)}`,
    'cursor': 'pointer',
    'backgroundColor': '#fff'
  })

  const headerStyles = css({
    'padding': `${rhythm(1)}`,
    'paddingBottom': `${rhythm(1.5)}`,
    'margin': `${rhythm(0.5)}`,
    'backgroundColor': '#fff',
    'fontSize': '32px',
    'fontWeight': 'bold'
  })

let user = "Brian"

export default function ModalDisplay({ props, isReady, setIsReady, mutate, vote }){


    let nameCharCount = nameObj(props.name)
    
    let textInput = useRef(null);

    return (

        <MuiThemeProvider theme={barTheme}>
            
            <div css={headerStyles}>{props.name}</div>
 
            <TextField
            
                label={isReady?"Press Enter to Submit!":"Enter Submission"}
                color={!isReady?"secondary":"primary"}
                inputRef={textInput}
                onChange={(e)=>{
                    
                    setIsReady(charCompare(nameCharCount,e.target.value)) 
                }}
                
                onKeyPress={(e)=>{
                    if(isReady){
                        if(e.key === 'Enter'){

                            mutate({
                                id: props.id,
                                content: e.target.value
                            })

                            textInput.current.value = ""

                            setIsReady(false)
                        }
                    }
                }}
            />

            {props.submissions.length>0?
                props.submissions.map(submission=>{

                    return (
            
                        <div 
                        
                            key={submission.id}
                            role="none"
                            onClick={()=>{
            
                                vote(props.id,submission)
                            }}
                            css={entryStyles}
                        >
                            <div style={{float: "left"}}>

                                {submission.submissionName}

                            </div>

                            <div style={{float: "right"}}>
                            
                                {submission.votedBy.length}
                                <span className="material-icons" style={{color: "red"}}>{submission.votedByMe?"favorite":"favorite_border"}</span>
                            </div>
                        </div>
                
                    )
                })
            : 
                null
            }
     
        </MuiThemeProvider>

    )
}