import React, {useRef, useState} from "react"
import TextField from "@material-ui/core/TextField"
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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

export default function SubmitDisplay ({ isReady, setIsReady, create, setModalProps, modalProps })  {
    
    let textInput = useRef(null)

    return (   
        <MuiThemeProvider theme={barTheme}>
            <TextField
                
                label={isReady?"Press Enter to Submit!":"Enter Submission"}
                color={!isReady?"secondary":"primary"}
                inputRef={textInput}
                onChange={(e)=>{
                    
                    setIsReady(e.target.value.length > 5)          
                }}
                
                onKeyPress={(e)=>{
                    if(isReady){
                        if(e.key === 'Enter'){

                            console.log(e.target.value)
                            create( e.target.value )
                            textInput.current.value = ""
                            setIsReady(false)
                            setModalProps({
                                ...modalProps,
                                open: false,
                                type: false
                            })           
                        }
                    }
                }}
            />
        </MuiThemeProvider>
    )
}