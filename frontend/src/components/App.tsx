import React, { useState, useEffect } from 'react';
import Header from './Header';
import Map from './Map';
import TemporaryDrawer from './TemporaryDrawer';
import ModalForm from './ModalForm';
import Socket from 'socket.io-client';

type Data = {
  category: string;
  type: string;
  name: string;
  position: number[];
};

type Args = {
  category: string;
  type: string;
};

let mapData: Data[];

const App: React.VFC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [check, setCheck] = useState(['']);

  if (data.length === 0) {
    mapData = [];
  } else {
    mapData = data;
  }

  let socket = Socket();
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connect');
    });
    socket.on('update-data', (updateData: Data[]) => {
      console.log('update-data');
      mapData = mapData.concat(updateData);
      setData(mapData);
    });
    return () => {
      console.log('disconnect');
      socket.close();
    };
  }, []);

  const sendData = (args: Args) => {
    console.log('send-data');
    socket.emit('send-data', args);
  };

  const removeData = (args: Args) => {
    const filterData = mapData.filter(
      (d) => !(d.category === args.category && d.type === args.type)
    );
    setData(filterData);
  };

  return (
    <div className={'main'}>
      <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Map data={data} />
      <TemporaryDrawer
        drawerOpen={drawerOpen}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        data={data}
        setData={setData}
        setCheck={setCheck}
      />
      <ModalForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        sendData={sendData}
        removeData={removeData}
        check={check}
        setCheck={setCheck}
      />
    </div>
  );
};

export default App;
