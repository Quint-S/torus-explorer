import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: pixelfont;
        src: url('/fonts/technofosiano.ttf');
    }
    
    body {
        background-color: #111;
        //color: rgba(0, 140, 255, 0.8);
        font-family: monospace;
        margin: 0;
        padding: 0;
        font-smooth: never;
        -webkit-font-smoothing : none;
    }

    * {
        box-sizing: border-box;
    }
    
`