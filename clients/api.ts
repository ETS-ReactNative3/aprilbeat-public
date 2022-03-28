import type { NextApiResponse } from "next";
import { serverVersion } from "@/constants/development";

export function rejectHandler(
  res: NextApiResponse,
  {
    status = 500,
    code = "unknown/rejected/unknown",
    reason = "A mistake on the server has occurred",
  }
) {
  const finalobj = {
    success: false,
    server: {
      version: serverVersion,
    },
    status: status,
    code: code,
    reason: reason,
  };
  res.status(status).send(finalobj);
  return true;
}

interface Resolvation {
  status?: number;
  code?: string;
  data: Object | any;
}

export function resolveHandler(
  res: NextApiResponse,
  { status = 200, code = "resolved/unknown", data = {} }: Resolvation
) {
  const finalobj = {
    success: true,
    server: {
      version: serverVersion,
    },
    status: status,
    code: code,
    data: data,
  };
  res.status(status).send(finalobj);
  return true;
}
