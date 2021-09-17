import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ret = await axios
    .get(`http://localhost:4000/api/datasets`)
    .then((r) => res.status(200).json(r.data))
    .catch((e) => console.log('error', 'status code:' + e.response.status));
}
