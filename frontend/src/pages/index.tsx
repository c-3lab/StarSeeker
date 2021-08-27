import dynamic from 'next/dynamic';
import React from 'react';

const App = dynamic(() => import('../components/App'), {
  ssr: false,
});

const Home: React.VFC = () => {
  return <App />;
};

export default Home;
