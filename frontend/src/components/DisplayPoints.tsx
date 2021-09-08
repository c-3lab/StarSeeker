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
	<table>
        <tr><th>ID：</th><td>${feature.properties['id']}</td></tr>
        <tr><th>場所名：</th><td>${feature.properties['name']}</td></tr>
        <tr><th>住所：</th><td>${feature.properties['address']}</td></tr>
	</table>
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
    <div id='test'>
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
    </div>
  );
};

export default DisplayPoints;
