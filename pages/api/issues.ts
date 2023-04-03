// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Issue from "@/types/Issue";
import type { NextApiRequest, NextApiResponse } from "next";

const apiUrl = "https://api.github.com";
type Headers = {
  Accept: string;
  Authorization: string;
  "X-GitHub-Api-Version": string;
};

const getIssues = async (
  headers: Headers,
  queryParams: string
): Promise<Issue[]> => {
  const issuesResponse = await fetch(`${apiUrl}/search/issues?${queryParams}`, {
    headers: headers,
  });
  return await issuesResponse.json();
};

const updateIssue = async (
  headers: Headers,
  owner: string,
  repo: string,
  title: string,
  body: string
): Promise<void> => {
  const issuesResponse = await fetch(
    `${apiUrl}/repos/${owner}/${repo}/issues`,
    {
      headers: headers,
    }
  );
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Issue[]>
) {
  const accessToken = req.cookies.accessToken;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
  } satisfies Headers;

  switch (req.method) {
    case "GET":
      const { q, page } = req.query;
      const queryParams = `q=${q}&per_page=10&page=${page}`;
      const issuesData = await getIssues(headers, queryParams);
      res.status(200).json(issuesData);
      break;
    case "POST":
      break;
    case "PATCH":
      break;
    case "DELETE":
      break;
    default:
      break;
  }
}
