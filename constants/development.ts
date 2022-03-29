export const isDev = process.env.NODE_ENV !== "production";
export const serveraddress = isDev
  ? "http://localhost:3000"
  : "https://aprilbeat.vercel.app";

export const serverVersion = "2022.328.0";