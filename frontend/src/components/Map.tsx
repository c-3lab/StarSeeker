import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import DisplayPoints from './DisplayPoints';
import DisplaySurfaces from './DisplaySurfaces';

const defaultPosition: LatLngTuple = [35.967169, 139.394617];
const defalutZoom: number = 13;

type Props = {
  pointsData: any[];
  surfacesData: any[];
};

const Map: React.VFC<Props> = ({ pointsData, surfacesData }) => {
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
      <DisplayPoints data={pointsData} />
      <DisplaySurfaces data={surfacesData} />
    </MapContainer>
  );
};

export default Map;
