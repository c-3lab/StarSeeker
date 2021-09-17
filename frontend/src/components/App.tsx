import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import TemporaryDrawer from './TemporaryDrawer';
import ModalForm from './ModalForm';
import axios from 'axios';
import Head from 'next/head';

const App: React.VFC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [check, setCheck] = useState<{ [key: string]: number }[]>([]);
  const [entityData, setEntityData] = useState([]);

  const removeData = (datasetId: { [key: string]: number }) => {
    const filterData = entityData.filter((d) => {
      let flg = true;
      Object.values(d).forEach((value) => {
        if (
          value['keyString'] === Object.keys(datasetId)[0] &&
          value['datasetId'] === Object.values(datasetId)[0]
        ) {
          flg = false;
          return;
        }
      });
      if (flg) {
        return true;
      }
      return false;
    });
    setEntityData(filterData);
  };

  const getEntityData = (
    datasetId: { [key: string]: number },
    iconColor: string
  ) => {
    async function getData() {
      const pointDatasetId = Object.values(datasetId)[0];
      const ret = await axios.get(
        `/api/points/entities?datasetId=${pointDatasetId}`
      );
      const data = entityData.slice();
      Object.values(ret.data).forEach((d) => {
        d['keyString'] = Object.keys(datasetId)[0];
        d['datasetId'] = pointDatasetId;
        d['iconColor'] = iconColor;
      });
      data.push(ret.data);
      setEntityData(data);
    }
    getData();
  };

  return (
    <div className={'main'}>
      <Head>
        <title>〇〇市ダッシュボード</title>
      </Head>
      <Header drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <Map data={entityData} />
      <TemporaryDrawer
        drawerOpen={drawerOpen}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        entityData={entityData}
        setEntityData={setEntityData}
        setCheck={setCheck}
      />
      <ModalForm
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        removeData={removeData}
        check={check}
        setCheck={setCheck}
        getEntityData={getEntityData}
      />
    </div>
  );
};

export default App;
