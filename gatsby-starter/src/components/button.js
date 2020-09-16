import React from "react";
import styled from "@emotion/styled";

export default function Button ({ children, ...props }) {

    return <StyledButton {...props}>{children}</StyledButton>;
    
}

const StyledButton = styled.button({
    color: 'turquoise',
    '&:hover': {
      color: 'hotpink',
      cursor: 'pointer'
    }
})