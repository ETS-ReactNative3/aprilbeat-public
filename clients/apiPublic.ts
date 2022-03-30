import { serveraddress } from "@/constants/development";
import { supabase } from "@/clients/supabasePublic";
import querystring from "querystring";
import type { User } from "@supabase/supabase-js";
import type { Users } from "@prisma/client";
import { logIt } from ".";

export async function apifetch(
  path: string,
  { json = true, params = {}, method = "GET", body = {}, authenticated = true }
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const authModule = supabase.auth;

    var authTokenFetch = "";
    if (authenticated) {
      const authSession = authModule.session();
      if (authSession) authTokenFetch = authSession.access_token;
    }

    let finalparams = "";
    if (Object.keys(params).length != 0)
      finalparams = querystring.stringify(params);

    let finaloptions: any = {
      method: method.toUpperCase(),
    };
    if (Object.keys(body).length != 0)
      finaloptions["body"] = JSON.stringify(body);

    // Start fetching
    const starttime = Date.now();
    logIt(`API Starting to fetch "${path}"`, {
      level: "info",
      source: "api_handler",
      raw: {
        path: path,
        params: params,
        options: finaloptions,
      },
    });

    await fetch(
      `${serveraddress}/api${path}?accessToken=${authTokenFetch}${
        finalparams ? `&${finalparams}` : ""
      }`,
      finaloptions
    )
      .then(async (response) => {
        let finalresponse;

        logIt(`API Queued to be processed for "${path}"`, {
          level: "info",
          source: "api_handler",
          raw: {
            rawresponse: response,
            path: path,
            params: params,
            options: finaloptions,
          },
        });

        if (json) finalresponse = await response.json();
        if (!finalresponse?.success) {
          logIt(
            `API Endpoint Failure for "${path}": ${
              finalresponse?.reason || "Unknown Error"
            }`,
            {
              level: "error",
              source: "api_handler",
              raw: { finalresponse },
            }
          );
          return reject(finalresponse);
        }
        logIt(
          `API Endpoint Success for "${path}": ${
            finalresponse?.code || "Unknown Success Code"
          } - Took ${Date.now() - starttime}ms`,
          {
            level: "success",
            source: "api_handler",
            raw: { finalresponse },
          }
        );
        // ga.event({
        //   action: "api_call-done",
        //   params: {
        //     path: path,
        //     params: JSON.stringify(params),
        //     options: JSON.stringify(finaloptions),
        //     response: JSON.stringify(finalresponse),
        //     timetofetch: `${Date.now() - starttime}ms`,
        //   },
        // });
        // NProgress.done(true);
        resolve(finalresponse?.data);
      })
      .catch((err) => {
        console.log(err);
        logIt(`API Endpoint Failure for "${path}": ${err || "Unknown Error"}`, {
          level: "error",
          source: "api_handler",
          raw: {
            path: path,
            error: err,
          },
        });
        // ga.event({
        //   action: "api_call-failure_generic",
        //   params: {
        //     path: path,
        //     error: err,
        //   },
        // });
        reject(err);
      });
  });
}

export async function checkIfAuth(): Promise<any> {
  const authModule = supabase.auth;
  const user = authModule.user();

  if (user) {
    return user;
  } else {
    return false;
  }
}

interface FetchedData {
  currentUserData: object;
  petData: object[];
  currentUser: object;
  authSession: object;
}
let pageProps: any = {};
export async function fetchAllData(): Promise<FetchedData> {
  return new Promise(async (resolve, reject): Promise<any> => {
    try {
      const authModule = supabase.auth;
      const currentUser = authModule.user();
      const authSession = authModule.session();
      pageProps.currentUser = currentUser;
      pageProps.authSession = authSession;

      pageProps.currentUserData = await apifetch(
        `/user/${currentUser?.id ? currentUser.id : "0"}`,
        { json: true, params: {} }
      );
      pageProps.petData = await apifetch(
        `/user/${currentUser?.id ? currentUser.id : "0"}/pets`,
        { json: true, params: {} }
      ).then((a: any) => {
        return a.pets;
      });

      resolve(pageProps);
    } catch (e) {
      reject(e);
    }
  });
}

export async function checkUserToken(accessToken: any): Promise<User> {
  return new Promise(async (resolve, reject) => {
    if (!accessToken) {
      reject({ code: 400, message: "Unauthenticated User" });
    }

    const auth = supabase.auth;
    const getuserDetails = await auth.api.getUser(accessToken.toString());
    const user: any = getuserDetails.user;
    if (!user) {
      return reject({
        code: 401,
        message: "Invalid User Authentication Keychain provided.",
      });
    }
    resolve(user);
  });
}

export const userSignup = async({ email, password, username }) => {
  return new Promise(async (res, rej) => {
    const dt = await apifetch("/auth/signup", {
      method: "POST",
      body: {
        email: email,
        password: password,
        username: username,
      },
    }).catch((err) => {
      rej(err)
      return
    })
    res(dt)
  });
}

export const userData = async(): Promise<Users> => {
  return new Promise(async (res, rej) => {
    const dt = await apifetch("/user/me", {
      method: "GET",
    }).catch((err) => {
      rej(err);
      return;
    });
    res(dt);
  });
}