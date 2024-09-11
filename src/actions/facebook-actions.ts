import { FB_APP_ID, FB_APP_SECRET, REDIRECT_URI } from "@/constants/facebook";
import axios from "axios";

export const getAccessToken = async (code: string) => {
  //   "use server";

  try {
    const response = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
      params: {
        client_id: FB_APP_ID,
        redirect_uri: REDIRECT_URI,
        client_secret: FB_APP_SECRET,
        code: code,
      },
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
