import React from 'react';
import { Polygon, useMap } from 'react-leaflet';
import Leaflet from 'leaflet';
import axios from 'axios';
import { getUniqueId } from '../utils/utils';

async function getDetails(
  datasetId: string,
  entityId: string
): Promise<string> {
  const ret = await axios.get(
    `/api/surfaces/details?datasetId=${datasetId}&entityId=${entityId}`
  );

  let html = '';
  ret.data.forEach((d) => {
    const isImage = d.dataType === 1;
    if (isImage) {
      html += `<tr><th>${d.displayTitle}</th><td><img src=${d.value} width="100%" height="100%"></td></tr>`;
    } else {
      html += `<tr><th>${d.displayTitle}</th><td>${d.value}</td></tr>`;
    }
  });

  const popupContent = `
    <table>
      <colgroup>
        <col style="width:33%">
        <col style="width:67%">
      </colgroup>
      <tbody>
        ${html}
      </tbody>
    </table>
  `;

  return popupContent;
}

const DisplaySurfaces: React.VFC<{ data: any[] }> = ({ data }) => {
  const map = useMap();
  map.closePopup();

  return (
    <>
      {data.flat().map((d) => {
        const positions = d.location.value.map((d) => {
          return d.split(',');
        });

        return (
          <Polygon
            key={getUniqueId()}
            positions={positions}
            pathOptions={{ color: d.borderColor, fillColor: d.fillColor }}
            eventHandlers={{
              click: async (e) => {
                const details = await getDetails(d.datasetId, d.id);
                Leaflet.popup()
                  .setLatLng(e.latlng)
                  .setContent(details)
                  .openOn(map);
              },
            }}
          />
        );
      })}
    </>
  );
};

export default React.memo(DisplaySurfaces);
