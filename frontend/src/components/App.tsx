import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import axios from 'axios';
import Head from 'next/head';

const App: React.VFC = () => {
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

  const resetEntityData = () => {
    setEntityData([]);
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
      />
      <Map data={entityData} />
    </div>
  );
};

export default App;
