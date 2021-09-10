import { NextApiRequest, NextApiResponse } from 'next';
import categories from '../../../../public/data/categories.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(categories);
}
