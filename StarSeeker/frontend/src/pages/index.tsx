import dynamic from 'next/dynamic';
import React from 'react';
import { AppProps } from 'next/app';

const App = dynamic(() => import('../components/App'), {
  ssr: false,
});

const Home: React.VFC<Props> = ({ fiware }) => {
  return <App fiware={fiware} />;
};

export async function getServerSideProps({ req }) {
  const fiware = {
    tenant: req.headers['fiware-service'] ? req.headers['fiware-service'] : null,
    servicePath: req.headers['fiware-servicepath'] ? req.headers['fiware-servicepath'] : null
  };

  return { props: { fiware }};
}

export default Home;
