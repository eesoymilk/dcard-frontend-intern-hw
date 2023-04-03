import cookie from "cookie";
import { GetServerSideProps } from "next";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const authUrl = "https://github.com/login/oauth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { code } = context.query;

  if (code) {
    const params = `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;
    const tokenResponse = await fetch(`${authUrl}/access_token?${params}`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
    const tokenData = await tokenResponse.json();
    console.log(tokenData);

    context.res.setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600,
        sameSite: "strict",
        path: "/",
      })
    );
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

export default function Callback() {
  return <></>;
}
