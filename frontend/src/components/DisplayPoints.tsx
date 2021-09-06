import React, { useCallback } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Layer } from 'leaflet';
import { GeoJsonObject, Feature, Geometry } from 'geojson';

function getUniqueId() {
  return (
    new Date().getTime().toString(16) +
    Math.floor(Math.random() * 1000).toString(16)
  );
}

const DisplayPoints = (props: { data: GeoJsonObject[] }) => {
  const onEachFeature = useCallback(
    (feature: Feature<Geometry, any>, layer: Layer) => {
      layer.bindPopup('');
      layer.addEventListener('click', () => {
        // TODO 詳細情報取得ＡＰＩ
        const popupContent = `
        <p>${feature.properties['id']}</p>
        <p>${feature.properties['name']}</p>
        <p>${feature.properties['address']}</p>
      `;
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
      {props.data.length !== 0 &&
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
