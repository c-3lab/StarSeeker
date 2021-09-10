import React, { useCallback } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Layer } from 'leaflet';
import { GeoJsonObject, Feature, Geometry } from 'geojson';
import axios from 'axios';

function getUniqueId() {
  return (
    new Date().getTime().toString(16) +
    Math.floor(Math.random() * 1000).toString(16)
  );
}

async function getDetails(
  datasetId: string,
  entityId: string
): Promise<string> {
  const ret = await axios.get(
    `/api/entities/entities?datasetId=${datasetId}&entityId=${entityId}`
  );
  const popupContent = `
    <table>
    <tr><th>ID：</th><td>${ret.data[0]['id']}</td></tr>
    <tr><th>場所名：</th><td>${ret.data[0]['locationName']['value']}</td></tr>
    <tr><th>住所：</th><td>${ret.data[0]['address']['value']}</td></tr>
    </table>
  `;
  return popupContent;
}

const DisplayPoints = (props: { data: GeoJsonObject[] }) => {
  const onEachFeature = useCallback(
    (feature: Feature<Geometry, any>, layer: Layer) => {
      layer.bindPopup('');
      layer.addEventListener('click', async () => {
        const popupContent = await getDetails(
          feature.properties['datasetId'],
          feature.properties['id']
        );
        layer.setPopupContent(popupContent);
      });
    },
    []
  );

  if (typeof props.data === 'undefined') {
    return null;
  }
  return (
    <>
      {props.data.length > 0 &&
        props.data.map((d) => {
          return (
            <GeoJSON
              key={getUniqueId()}
              data={d}
              onEachFeature={onEachFeature}
            />
          );
        })}
    </>
  );
};

export default DisplayPoints;
