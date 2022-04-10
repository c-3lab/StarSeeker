import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { datasetId, q } = req.query;
  let url;
  if (datasetId != null) {
    url = `http://nodeb:4000/api/points/${encodeURIComponent(
      datasetId.toString()
    )}/entities?limit=1000`;
  } else {
    url = `http://nodeb:4000/api/points/entities?limit=1000`;
  }
  if (q != null) {
    url += `&q=${q}`;
  }

  await axios
    .get(url)
    .then((r) => res.status(200).json(r.data))
    .catch((e) => console.log('error', 'status code：' + e.response.status));
}
