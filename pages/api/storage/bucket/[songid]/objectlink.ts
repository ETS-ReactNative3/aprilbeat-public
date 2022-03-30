// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/clients/supabase";
import { prismaClient } from "@/clients/prisma";
import { rejectHandler } from "@/clients/api";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { songid } = req.query

    const thesong = await prismaClient.songs.findFirst({
      where: {
        id: songid.toString()
      }
    })
    if (!thesong) return rejectHandler(res, {
      code: 'song/not_found',
      reason: 'Song not found in database',
      status: 404
    })
    const songbucketname = thesong.filename as string;

  supabase.storage
    .from("songs")
    .createSignedUrl(songbucketname, 10)
    .then((data) => {
      res.status(200).send(data.signedURL);
    });

    // supabase.storage
    //   .from("songs")
    //   .download("geoxor_svrge_1")
    //   .then((data) => {
    //     console.log(data);
    //     data.data?.stream().pipe(res);
    //   });
}
