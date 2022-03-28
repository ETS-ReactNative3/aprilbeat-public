import { serveraddress } from "@/constants/development";
import { supabase } from "@/clients/supabasePublic";
import querystring from "querystring";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/main/lib/SupabaseAuthClient";
import { User } from "@supabase/supabase-js";
import { logIt } from ".";

export async function apifetch(
  path: string,
  { json = true, params = {}, method = "GET", body = {}, authenticated = true }
) {
  return new Promise(async (resolve, reject) => {
    const authModule = supabase.auth;

    let authTokenFetch: any;
    let currentUserFetch: any;
    if (authenticated) {
      currentUserFetch = authModule.user();
      const authSession = authModule.session();
      if (authSession) {
        authTokenFetch = authSession.access_token;
      }
    }

    let finalparams = "";
    if (Object.keys(params).length != 0) {
      finalparams = querystring.stringify(params);
    }

    let finaloptions: any = {
      method: method.toUpperCase(),
    };
    if (Object.keys(body).length != 0) {
      finaloptions["body"] = JSON.stringify(body);
    }

    if (true) {
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
      // ga.event({
      //   action: "api_call",
      //   params: {
      //     path: path,
      //     params: params,
      //     options: finaloptions,
      //   },
      // });
      // NProgress.start();

      await fetch(
        `${serveraddress}/api${path}?accessToken=${authTokenFetch || 0}${
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
          if (finalresponse?.success == false) {
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
            // ga.event({
            //   action: "api_call-failure",
            //   params: {
            //     path: path,
            //     params: JSON.stringify(params),
            //     options: JSON.stringify(finaloptions),
            //     response: JSON.stringify(finalresponse),
            //   },
            // });
            // NProgress.done(true);
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
          logIt(
            `API Endpoint Failure for "${path}": ${err || "Unknown Error"}`,
            {
              level: "error",
              source: "api_handler",
              raw: {
                path: path,
                error: err,
              },
            }
          );
          // ga.event({
          //   action: "api_call-failure_generic",
          //   params: {
          //     path: path,
          //     error: err,
          //   },
          // });
          reject(err);
        });
    } else {
      reject("User not signed in");
    }
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

interface fetchedData {
  currentUserData: object;
  petData: object[];
  currentUser: object;
  authSession: object;
}
let pageProps: any = {};
export async function fetchAllData(): Promise<fetchedData> {
  return new Promise(async (resolve, reject): Promise<any> => {
    try {
      const authModule = supabase.auth;
      const currentUser = authModule.user();
      const authSession = authModule.session();
      pageProps.currentUser = currentUser;
      pageProps.authSession = authSession;
      let authToken: string;
      if (authSession) {
        authToken = authSession.access_token;
      }

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
