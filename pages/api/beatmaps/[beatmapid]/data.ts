// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "@/clients/prisma";
import { rejectHandler, resolveHandler } from "@/clients/api";
import { supabase } from "@/clients/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { beatmapid } = req.query;
  console.log(req.query);
  const thebeatmap = await prismaClient.beatmaps.findFirst({
    where: {
      id: beatmapid.toString(),
    },
  });
  const thesong = await prismaClient.songs.findFirst({
    where: {
      id: thebeatmap?.songid?.toString(),
    },
  });
  if (!thebeatmap || !thesong) {
    return rejectHandler(res, {
      code: "beatmap/not_found",
      reason: "Beatmap or song is not found in database",
      status: 404,
    });
  }

  const signedAudioUrl = await supabase.storage
    .from("songs")
    .createSignedUrl(thesong.filename as string, 600);
    const signedImageUrl = await supabase.storage
      .from("images")
      .createSignedUrl(thebeatmap.imageid as string, 600);

    const finaldata = Object.assign(thebeatmap, {
      signedURL: signedAudioUrl.signedURL,
      signedImageUrl: signedImageUrl.signedURL,
    });

    resolveHandler(res, {
      data: finaldata,
      code: "beatmap/resolved",
      status: 200
    })
}
