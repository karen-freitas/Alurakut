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
    background-image:url('https://i.pinimg.com/236x/48/05/17/480517be2158c6e56ec9ef8e227c2395.jpg');
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
