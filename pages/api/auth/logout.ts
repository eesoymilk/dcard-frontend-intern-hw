import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function Logout(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  res
    .setHeader(
      "Set-Cookie",
      cookie.serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        sameSite: "strict",
        path: "/",
      })
    )
    .status(200)
    .json({ message: "success" });
}
