import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import TemporaryDrawer from './TemporaryDrawer';
import ModalForm from './ModalForm';
import { GeoJsonObject } from 'geojson';
import axios from 'axios';
import Head from 'next/head';

const App: React.VFC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [check, setCheck] = useState(['']);
  const [entityData, setEntityData] = useState<GeoJsonObject[]>([]);

  const removeData = (arg: string) => {
    // TODO
    const filterData = entityData.filter((d) => {
      let flg = true;
      Object.values(d['features']).forEach((value) => {
        Object.keys(value['properties']).forEach((key) => {
          if (key == 'name') {
            if (value['properties'][key].replace(/[0-9]/g, '') === arg) {
              flg = false;
              return;
            }
          }
        });
      });
      if (flg) {
        return true;
      }
      return false;
    });
    setEntityData(filterData);
  };

  const getEntityData = (arg: string) => {
    async function getData() {
      const ret = await axios.get(`/api/points/entities?type=${arg}`);
      const data = entityData.slice();
      Object.values(ret.data).forEach((d) => {
        Object.values(d).forEach((d) => {
          d['properties']['datasetId'] = arg === 'Hospital' ? 1 : 2;
        });
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
