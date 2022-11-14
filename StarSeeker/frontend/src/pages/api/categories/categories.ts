import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tenant = req.headers.tenant ? req.headers.tenant: null;
  const servicePath = req.headers.servicepath ? req.headers.servicepath : null;
  let headers;
  if (tenant != null) {
    if (servicePath != null) {
      headers = { 'x-headers': req.headers, 'fiware-service': tenant, 'fiware-servicepath': servicePath };
    } else {
      headers = { 'x-headers': req.headers, 'fiware-service': tenant };
    }
  } else {
    if (servicePath != null) {
      headers = { 'x-headers': req.headers, 'fiware-servicepath': servicePath };
    } else {
      headers = { 'x-headers': req.headers };
    }
  }
  const ret = await axios
    .get(`http://nodeb:4000/api/categories`, { headers: headers })
    .then((r) => res.status(200).json(r.data))
    .catch((e) => console.log('error', 'status code:' + e.response.status));
}
