import React from "react"
import { css } from "@emotion/core"
import { rhythm } from "../utils/typography"



export default function Layout({ children }) {

  let button = children.props.children[0]
  let names = children.props.children[1]

  return (

<div className="container"
  css={css`
    width: 60em;
    margin: 0 auto;
    
  `}
  >

    <div
      css={css`
        
        margin: 2em auto;
        padding: ${rhythm(2)};
        padding-top: ${rhythm(1.5)};
        float: left;
      `}
    >

    {button}

    </div>

    <div
      css={css`
        margin: 2em auto;
        max-width: 700px;
        padding: ${rhythm(2)};
        padding-top: ${rhythm(1.5)};
        float: left;
    
      `}
    >

      {names}

    </div>
  </div>
  )
}