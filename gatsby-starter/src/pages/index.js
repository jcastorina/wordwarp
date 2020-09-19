import React from "react"
import "../styles/app.css"
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import UserProvider from "../contexts/user"
import Root from "../containers/root"

export default function App () {
    
    return (    
        <MuiThemeProvider theme={siteTheme}>
            <UserProvider>
                <Root/>
            </UserProvider>
        </MuiThemeProvider>       
    )
}

const siteTheme = createMuiTheme({
    palette: {
      primary: {
          main: "hsla(0,0%,0%,0.8)"
      },
      secondary: {
        main: 'rgb(255, 105, 180)'
      },
    },
})
