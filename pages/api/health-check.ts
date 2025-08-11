import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Health check endpoint called')
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    method: req.method,
    headers: req.headers.host
  })
}