import React from "react";
import { useSpring, animated } from 'react-spring';

export default function Test ({children}) {

    const props = useSpring({ opacity: 0, from: { opacity: 1 }})
    return <animated.div style={props}>{children}</animated.div>;
}