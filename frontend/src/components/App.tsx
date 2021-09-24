import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import axios from 'axios';
import Head from 'next/head';

const App: React.VFC = () => {
  const [pointsData, setPointsData] = useState([]);
  const [surfacesData, setSurfacesData] = useState([]);

  const getPointsData = (datasetId: number, iconColor: string) => {
    async function getData() {
      const ret = await axios.get(
        `/api/points/entities?datasetId=${datasetId}`
      );
      Object.values(ret.data).forEach((d) => {
        d['datasetId'] = datasetId;
        d['iconColor'] = iconColor;
      });
      const data = pointsData.slice();
      data.push(ret.data);
      setPointsData(data);
    }
    getData();
  };

  const removePointsData = (datasetId: number) => {
    const filterData = pointsData.filter((d, i) => {
      if (d[i].datasetId !== datasetId) {
        return true;
      }
    });
    setPointsData(filterData);
  };

  const getSurfacesData = (
    datasetId: number,
    borderColor: string,
    fillColor: string
  ) => {
    async function getData() {
      const ret = await axios.get(
        `/api/surfaces/entities?datasetId=${datasetId}`
      );
      Object.values(ret.data).forEach((d) => {
        d['datasetId'] = datasetId;
        d['borderColor'] = borderColor;
        d['fillColor'] = fillColor;
      });
      const data = surfacesData.slice();
      data.push(ret.data);
      setSurfacesData(data);
    }
    getData();
  };

  const removeSurfacesData = (datasetId: number) => {
    const filterData = surfacesData.filter((d, i) => {
      if (d[i].datasetId !== datasetId) {
        return true;
      }
    });
    setSurfacesData(filterData);
  };

  const resetData = () => {
    setPointsData([]);
    setSurfacesData([]);
  };

  return (
    <div className={'main'}>
      <Head>
        <title>〇〇市ダッシュボード</title>
      </Head>
      <Header
        getPointsData={getPointsData}
        removePointsData={removePointsData}
        getSurfacesData={getSurfacesData}
        removeSurfacesData={removeSurfacesData}
        resetData={resetData}
      />
      <Map pointsData={pointsData} surfacesData={surfacesData} />
    </div>
  );
};

export default App;
