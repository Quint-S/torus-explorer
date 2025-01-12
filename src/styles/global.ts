import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: pixelfont;
        src: url('/fonts/IBM/WebPlus_IBM_VGA_8x16.woff');
    }
    
    body {
        background-color: #111;
        //color: rgba(0, 140, 255, 0.8);
        font-family: pixelfont, monospace;
        font-size: 16px;
        margin: 0;
        padding: 0;
        font-smooth: never;
        -webkit-font-smoothing : none;
    }

    * {
        box-sizing: border-box;
    }
    
`