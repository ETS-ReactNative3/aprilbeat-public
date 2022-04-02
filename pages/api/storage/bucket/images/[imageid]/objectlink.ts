// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/clients/supabase";
import { prismaClient } from "@/clients/prisma";
import { rejectHandler, resolveHandler } from "@/clients/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { imageid } = req.query

   const theimage = await supabase.storage
    .from("images")
    .createSignedUrl(imageid.toString(), 600)

    if (!theimage.signedURL || theimage.error)
      return rejectHandler(res, {
        code: "image/not_found",
        reason: "Image not found in database",
        status: 404,
    });

      resolveHandler(res, {
        data: {
          signedURL: theimage?.signedURL
        },
      });
}
