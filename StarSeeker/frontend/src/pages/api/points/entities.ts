import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { datasetId } = req.query;
  await axios
    .get(
      `http://nodeb:4000/api/points/${encodeURIComponent(
        datasetId.toString()
      )}/entities?limit=1000`
    )
    .then((r) => res.status(200).json(r.data))
    .catch((e) => console.log('error', 'status code：' + e.response.status));
}
