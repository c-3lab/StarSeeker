import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import DisplayPoints from './DisplayPoints';
import DisplaySurfaces from './DisplaySurfaces';

const defaultPosition: LatLngTuple = [
  process.env.NEXT_PUBLIC_MAP_DEFAULT_LATITUDE,
  process.env.NEXT_PUBLIC_MAP_DEFAULT_LONGITUDE,
];
const defalutZoom: number = process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM;

type Props = {
  pointEntities: any[];
  surfaceEntities: any[];
  fiware: {
    tenant: string;
    servicePath: string;
  };
};

const ClosePopup = () => {
  const map = useMap();
  map.closePopup();
  return null;
};

const Map: React.VFC<Props> = ({ pointEntities, surfaceEntities, fiware }) => {
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
        <DisplayPoints key={index} data={data} fiware={fiware} />
      ))}
      {surfaceEntities.map((data, index) => (
        <DisplaySurfaces key={index} data={data} fiware={fiware} />
      ))}
      <ClosePopup />
    </MapContainer>
  );
};

export default Map;
