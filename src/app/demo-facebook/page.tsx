"use client";

import { getAccessToken } from "@/actions/facebook-actions";
import { FB_APP_ID, REDIRECT_URI } from "@/constants/facebook";
import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LoginButton, FacebookProvider } from "react-facebook";

const facebookLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=email,public_profile`;
export default function DemoPage() {
  const pathname = useSearchParams();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<unknown>(null);

  const handleGetAccessToken = async () => {
    const code = pathname.get("code");
    if (!code) {
      console.log("missing code!!!!");
      return;
    }

    console.log("it run");
    const res: any = await getAccessToken(code ?? "");
    setAccessToken(res?.data.access_token as string);

    if (res?.data.access_token) {
      const resAs = await axios.get(`https://graph.facebook.com/me`, {
        params: {
          access_token: res?.data.access_token,
          fields: "id,name,email,picture",
        },
      });

      setUser(resAs?.data);
    }
  };

  console.log({ user });

  return (
    <div className="m-5 flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <a
          href={facebookLoginUrl}
          className="py-2 px-4 rounded-md bg-blue-500 text-white font-medium"
        >
          Login via Facebook
        </a>
        <button
          onClick={handleGetAccessToken}
          className="px-4 py-2 rounded-md bg-green-600 text-white font-medium"
        >
          Get Access Token
        </button>
        {/* 
          <LoginButton scope="email" onError={handleError} onSuccess={handleSuccess}>
            Login via Facebook
          </LoginButton> */}
        <FacebookLogin
          appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}
          onSuccess={(response) => {
            console.log("Login Success!", response);
          }}
          onFail={(error) => {
            console.log("Login Failed!", error);
          }}
          onProfileSuccess={(response) => {
            console.log("Get Profile Success!", response);
          }}
        />
      </div>
      <p className="text-xs">{accessToken}</p>
      <FacebookProvider appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!}>
        <LoginButton
          scope="email"
          onSuccess={(success) => {
            console.log("Login Success!", success);
          }}
          onError={(error) => {
            console.log("Login failed!", error);
          }}
          returnScopes
        >
          Login via Facebook
        </LoginButton>
      </FacebookProvider>
    </div>
  );
}
