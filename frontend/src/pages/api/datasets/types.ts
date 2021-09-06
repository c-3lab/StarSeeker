import { NextApiRequest, NextApiResponse } from 'next';
import types from '../../../../public/data/types.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(types);
}
