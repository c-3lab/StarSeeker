import React from 'react';
import { Polygon, useMap } from 'react-leaflet';
import Leaflet from 'leaflet';
import axios from 'axios';
import { escapeSpecialCharacters } from '../utils';

async function fetchDetails(
  datasetId: string,
  entityId: string,
  fiware: any
): Promise<string> {
  const tenant = fiware.tenant;
  const servicePath = fiware.servicePath;
  const headers = {
    'tenant': tenant,
    'servicepath': servicePath
   };
  if(!tenant) {
    delete headers['tenant'];
  }
  if(!servicePath) {
    delete headers['servicepath'];
  }
  const res = await axios.get(
    `/api/surfaces/details?datasetId=${datasetId}&entityId=${entityId}`,
    { headers: headers }
  );

  let html = '';
  res.data.forEach((d) => {
    html += `<tr><th>${escapeSpecialCharacters(
      d.displayTitle
    )}</th><td>${escapeSpecialCharacters(d.value)}</td></tr>`;
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

const DisplaySurfaces: React.VFC<{ data: any, fiware: any }> = ({ data, fiware }) => {
  const map = useMap();
  const positions = data.location.value.map((d) => d.split(','));

  return (
    <Polygon
      positions={positions}
      pathOptions={{ color: data.borderColor, fillColor: data.fillColor }}
      eventHandlers={{
        click: async (e) => {
          const details = await fetchDetails(data.datasetId, data.id, fiware);
          Leaflet.popup().setLatLng(e.latlng).setContent(details).openOn(map);
        },
      }}
    />
  );
};

export default React.memo(DisplaySurfaces);
