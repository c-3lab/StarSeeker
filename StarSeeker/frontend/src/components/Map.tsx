import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import DisplayPoints from './DisplayPoints';
import DisplaySurfaces from './DisplaySurfaces';

const defaultPosition: LatLngTuple = [35.967169, 139.394617];
const defalutZoom: number = 13;

type Props = {
  pointEntities: any[];
  surfaceEntities: any[];
};

const ClosePopup = () => {
  const map = useMap();
  map.closePopup();
  return null;
};

const Map: React.VFC<Props> = ({ pointEntities, surfaceEntities }) => {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={defalutZoom}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <ZoomControl position={'bottomleft'} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pointEntities.map((data, index) => (
        <DisplayPoints key={index} data={data} />
      ))}
      {surfaceEntities.map((data, index) => (
        <DisplaySurfaces key={index} data={data} />
      ))}
      <ClosePopup />
    </MapContainer>
  );
};

export default Map;
