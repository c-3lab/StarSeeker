import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useMap, Marker } from 'react-leaflet';
import Leaflet from 'leaflet';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

async function fetchDetails(
  datasetId: string,
  entityId: string
): Promise<string> {
  const res = await axios.get(
    `/api/points/details?datasetId=${datasetId}&entityId=${entityId}`
  );

  let html = '';
  res.data.forEach((d) => {
    const isImage = d.dataType === 1;
    if (isImage) {
      html += `
        <tr><th>${d.displayTitle}</th>
        <td>
        <div>
          <label for="popup-on">
            画像クリックで拡大表示
            <div class="img-cursor">
              <img src=${d.value} width="100%" height="100%">
            </div>
          </label>
          <input type="checkbox" id="popup-on">
          <div class="popup">
            <label for="popup-on" class="icon-close">×</label>
            <div class="popup-content">              
              <img src=${d.value} width="100%" height="100%">
            </div>
          </div>
        </div>
      </td></tr>`;
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

const DisplayPoints: React.VFC<{ data: any }> = ({ data }) => {
  const map = useMap();
  const position = data.location.value.split(',');

  return (
    <Marker
      position={[position[0], position[1]]}
      icon={Leaflet.divIcon({
        html: ReactDOMServer.renderToString(
          <span className="fa-stack">
            <FontAwesomeIcon
              className={'fa-stack-1x'}
              icon={faMapMarker}
              size={'2x'}
              color={'#FFFFFF'}
            />
            <FontAwesomeIcon
              className={'fa-stack-1x'}
              icon={faMapMarkerAlt}
              size={'2x'}
              color={data.iconColor}
            />
          </span>
        ),
        className: '',
      })}
      eventHandlers={{
        click: async () => {
          const details = await fetchDetails(data.datasetId, data.id);
          Leaflet.popup().setLatLng(position).setContent(details).openOn(map);
        },
      }}
    />
  );
};

export default React.memo(DisplayPoints);
