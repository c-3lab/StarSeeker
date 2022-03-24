import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { datasetId, entityId } = req.query;
  await axios
    .get(
      `http://nodeb:4000/api/points/${encodeURIComponent(
        datasetId.toString()
      )}/${encodeURIComponent(entityId.toString())}/details`
    )
    .then((r) => res.status(200).json(r.data))
    .catch((e) => console.log('error', 'status code：' + e.response.status));
}
