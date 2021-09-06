import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import Leaflet, { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { GeoJsonObject } from 'geojson';
import DisplayPoints from '../components/DisplayPoints';

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/';

const defaultPosition: LatLngTuple = [35.967169, 139.394617];
const defalutZoom: number = 13;

const Map: React.VFC<{ data: GeoJsonObject[] }> = (data) => {
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
      <DisplayPoints data={data.data} />
    </MapContainer>
  );
};

export default Map;
