import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import DisplayPoints from './DisplayPoints';
import DisplaySurfaces from './DisplaySurfaces';

const loadEnvAsNumber = (variable: string | undefined, defaultValue: number): number => {
  if (!variable) return defaultValue
  const value = parseFloat(variable)
  if (Number.isNaN(value)) return defaultValue
  return value
}

const defaultLatitude = loadEnvAsNumber(String(process.env.NEXT_PUBLIC_MAP_DEFAULT_LATITUDE), 35.6581107);
const defaultLongitude = loadEnvAsNumber(String(process.env.NEXT_PUBLIC_MAP_DEFAULT_LONGITUDE), 139.7387888);
const defaultZoom = loadEnvAsNumber(String(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM), 13);

const defaultPosition: LatLngTuple = [
  defaultLatitude,
  defaultLongitude,
];

type Props = {
  pointEntities: any[];
  surfaceEntities: any[];
  fiware: any[];
};

const ClosePopup = () => {
  const map = useMap();
  map.closePopup();
  return null;
};

const Map: React.FC<Props> = ({ pointEntities, surfaceEntities, fiware }) => {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={defaultZoom}
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
