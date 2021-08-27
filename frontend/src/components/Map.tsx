import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet, { LatLngTuple } from 'leaflet';
import React from 'react';
import 'leaflet/dist/leaflet.css';

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/';

const defaultPosition: LatLngTuple = [43.094549308747375, 141.37187351680467];
const defalutZoom: number = 16;

type Data = {
  name: string;
  position: number[];
};

const Map: React.VFC<{ data: Data[] }> = (data) => {
  return (
    <MapContainer
      center={defaultPosition}
      zoom={defalutZoom}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.data.map((d) => (
        <Marker key={d.name} position={[d.position[0], d.position[1]]}>
          <Popup position={[d.position[0], d.position[1]]}>
            <div>{d.name}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
