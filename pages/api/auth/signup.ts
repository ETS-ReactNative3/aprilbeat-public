// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { rejectHandler, resolveHandler } from "@/clients/api";
import { prismaClient } from "@/clients/prisma";
import { supabase } from "@/clients/supabase";
import { serverAddress } from "@/constants/development";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST")
    return rejectHandler(res, {
      code: "rejected/method_invalid",
      reason: "Request Method not allowed, must be POST.",
      status: 403,
    });

  const bodyparsed = JSON.parse(req.body);
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = bodyparsed;

  //   const checkbeforeuserdata = await prismaClient.users.findFirst({
  //     where: {
  //       userid: user.id,
  //     },
  //   });
  //   if (checkbeforeuserdata) {
  //     rejectHandler(res, {
  //       code: "rejected/user_already_exists_indb",
  //       reason: "User already exists",
  //       status: 403,
  //     });
  //     return;
  //   }

  const newuser = await supabase.auth.signUp(
    {
      email: email,
      password: password,
    },
    {
      redirectTo: `${serverAddress}/auth/action?from=apisignup`,
    }
  );

  const userdata = await prismaClient.users.create({
    data: {
      userid: newuser?.user?.id,
      username: username,
      lastseen: Date.now().toString(),
      status: 'online'
    },
  });
  prismaClient.$disconnect();

  resolveHandler(res, {
    code: "resolved/success",
    data: userdata,
    status: 200,
  });
}
