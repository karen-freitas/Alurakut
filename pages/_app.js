import { createGlobalStyle, ThemeProvider } from 'styled-components'
import {AlurakutStyles} from '../src/lib/AlurakutCommons';

const GlobalStyle = createGlobalStyle`

  *{
    margin:0;
    padding:0;
    box-sizing:border-box;

  }
  body {
    font-family:sans-serif;
    background-image: radial-gradient( circle farthest-corner at 49.6% 51.4%, rgba(172,194,212) 31.5%, rgba(170,120,180) 90% );
    background-size:cover;
  }

  #__next {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ${AlurakutStyles}


`

const theme = {
  colors: {
    primary: '#0070f3',
  },
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
