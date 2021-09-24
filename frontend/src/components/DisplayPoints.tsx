import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { useMap, Marker } from 'react-leaflet';
import Leaflet from 'leaflet';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { getUniqueId } from '../utils/utils';

async function getDetails(
  datasetId: string,
  entityId: string
): Promise<string> {
  const ret = await axios.get(
    `/api/points/details?datasetId=${datasetId}&entityId=${entityId}`
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

const DisplayPoints: React.VFC<{ data: any[] }> = ({ data }) => {
  const map = useMap();
  map.closePopup();

  return (
    <>
      {data.flat().map((d) => {
        const position = d.location.value.split(',');
        return (
          <Marker
            key={getUniqueId()}
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
                    color={d.iconColor}
                  />
                </span>
              ),
              className: '',
            })}
            eventHandlers={{
              click: async () => {
                const details = await getDetails(d.datasetId, d.id);
                Leaflet.popup()
                  .setLatLng(position)
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

export default React.memo(DisplayPoints);
