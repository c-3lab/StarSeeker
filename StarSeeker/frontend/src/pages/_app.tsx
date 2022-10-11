import '../styles/globals.css';
import App, { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component { ...pageProps } />;
}

export default MyApp;
