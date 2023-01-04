import React, { useState } from 'react';
import Header from './Header';
import Map from './Map';
import axios from 'axios';
import Head from 'next/head';
import { AppProps } from 'next/app';

const App: React.VFC<Props> = ({ fiware }) => {
  const [pointEntities, setPointEntities] = useState([]);
  const [surfaceEntities, setSurfaceEntities] = useState([]);

  const fetchPointData = async (datasetId: number, iconColor: string) => {
    const tenant = fiware.tenant;
    const servicePath = fiware.servicePath;
    const headers = {
      'tenant': tenant,
      'servicepath': servicePath
    };
    if(!tenant) {
      delete headers['tenant'];
    }
    if(!servicePath) {
      delete headers['servicepath'];
    }
    const res = await axios.get(
      `/api/points/entities?datasetId=${datasetId}`,
      { headers: headers }
    );
    const newEntities = res.data.map((entity) => {
      return { ...entity, datasetId, iconColor };
    });
    setPointEntities([...pointEntities, ...newEntities]);
  };

  const clearAllPointData = (datasetId: number) => {
    const filteredData = pointEntities.filter(
      (d) => d.length === 0 || d.datasetId !== datasetId
    );
    setPointEntities(filteredData);
  };

  const fetchSurfaceData = async (
    datasetId: number,
    borderColor: string,
    fillColor: string
  ) => {
    const tenant = fiware.tenant;
    const servicePath = fiware.servicePath;
    const headers = {
      'tenant': tenant,
      'servicepath': servicePath
    };
    if(!tenant) {
      delete headers['tenant'];
    }
    if(!servicePath) {
      delete headers['servicepath'];
    }
    const res = await axios.get(
      `/api/surfaces/entities?datasetId=${datasetId}`,
      { headers: headers }
    );
    const newEntities = res.data.map((entity) => {
      return { ...entity, datasetId, borderColor, fillColor };
    });
    setSurfaceEntities([...surfaceEntities, ...newEntities]);
  };

  const clearAllSurfaceData = (datasetId: number) => {
    const filteredData = surfaceEntities.filter(
      (d) => d.length === 0 || d.datasetId !== datasetId
    );
    setSurfaceEntities(filteredData);
  };

  const resetData = () => {
    setPointEntities([]);
    setSurfaceEntities([]);
  };

  const title = 'ダッシュボード';

  return (
    <div className={'main'}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header
        fetchPointData={fetchPointData}
        clearAllPointData={clearAllPointData}
        fetchSurfaceData={fetchSurfaceData}
        clearAllSurfaceData={clearAllSurfaceData}
        resetData={resetData}
        fiware={fiware}
      />
      <Map
        pointEntities={pointEntities}
        surfaceEntities={surfaceEntities}
        fiware={fiware}
      />
    </div>
  );
};

export default App;
