import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import axios from 'axios';
import Head from 'next/head';

const App: React.VFC = () => {
  const [entityData, setEntityData] = useState([]);
  const [surfaceData, setSurfaceData] = useState([]);

  const removeData = (datasetId: number) => {
    const filterData = entityData.filter((d) => {
      let flg = true;
      Object.values(d).forEach((value) => {
        if (value['datasetId'] === datasetId) {
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

  const getEntityData = (datasetId: number, iconColor: string) => {
    async function getData() {
      const ret = await axios.get(
        `/api/points/entities?datasetId=${datasetId}`
      );
      const data = entityData.slice();
      Object.values(ret.data).forEach((d) => {
        d['datasetId'] = datasetId;
        d['iconColor'] = iconColor;
      });
      data.push(ret.data);
      setEntityData(data);
    }
    getData();
  };

  const removeSurfaceData = (datasetId: number) => {
    const filterData = surfaceData.filter((d) => {
      let flg = true;
      Object.values(d).forEach((value) => {
        if (value['datasetId'] === datasetId) {
          flg = false;
          return;
        }
      });
      if (flg) {
        return true;
      }
      return false;
    });
    setSurfaceData(filterData);
  };

  const getSurfaceData = (
    datasetId: number,
    borderColor: string,
    fillColor: string
  ) => {
    async function getData() {
      const ret = await axios.get(
        `/api/surfaces/entities?datasetId=${datasetId}`
      );
      const data = surfaceData.slice();
      Object.values(ret.data).forEach((d) => {
        d['datasetId'] = datasetId;
        d['borderColor'] = borderColor;
        d['fillColor'] = fillColor;
      });
      data.push(ret.data);
      setSurfaceData(data);
    }
    getData();
  };

  const resetEntityData = () => {
    setEntityData([]);
    setSurfaceData([]);
  };

  return (
    <div className={'main'}>
      <Head>
        <title>〇〇市ダッシュボード</title>
      </Head>
      <Header
        getEntityData={getEntityData}
        removeData={removeData}
        resetEntityData={resetEntityData}
        getSurfaceData={getSurfaceData}
        removeSurfaceData={removeSurfaceData}
      />
      <Map entityData={entityData} surfaceData={surfaceData} />
    </div>
  );
};

export default App;
