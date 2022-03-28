// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import appRoot from "app-root-path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const audiostream = fs.createReadStream(`${appRoot}/public/geoxorNana.mp3`);
  audiostream.pipe(res);
}
