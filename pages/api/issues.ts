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

const createIssue = async (
  headers: Headers,
  owner: string,
  repo: string,
  title: string,
  body: string,
  labels: string[]
) => {
  const res = await fetch(`${apiUrl}/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      title,
      body,
      labels,
    }),
  });
  console.log(res);

  const data = await res.json();
  return data;
};

const closedIssue = async (
  headers: Headers,
  owner: string,
  repo: string,
  issue_number: number
) => {
  const res = await fetch(
    `${apiUrl}/repos/${owner}/${repo}/issues/${issue_number}`,
    {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({
        state: "closed",
      }),
    }
  );
  if (res.status === 200) return;
};

const updateIssue = async (
  headers: Headers,
  owner: string,
  repo: string,
  issue_number: number,
  title: string,
  body: string,
  labels: string[]
): Promise<Issue> => {
  const res = await fetch(
    `${apiUrl}/repos/${owner}/${repo}/issues/${issue_number}`,
    {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify({
        title,
        body,
        labels,
      }),
    }
  );
  console.log(res);

  const data = await res.json();
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Issue | Issue[] | { message: string }>
) {
  const accessToken = req.cookies.accessToken;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
  } satisfies Headers;

  const { owner, repo, issue_number, title, body, labels } = req.body;

  switch (req.method) {
    case "GET":
      const { q, page } = req.query;
      const queryParams = `q=${q}&per_page=10&page=${page}`;
      const issuesData = await getIssues(headers, queryParams);
      res.status(200).json(issuesData);
      break;

    case "POST":
      console.log("NEW: ", req.body);
      const createdData = await createIssue(
        headers,
        owner,
        repo,
        title,
        body,
        labels
      );
      console.log(createdData);
      res.status(200).json({ message: "SUCCESS" });
      break;

    case "PATCH":
      console.log("PATCHING: ", req.body);
      const updatedData = await updateIssue(
        headers,
        owner,
        repo,
        issue_number,
        title,
        body,
        labels
      );
      res.status(200).json(updatedData);
      break;

    case "DELETE":
      console.log("DELETEING: ", req.body);
      await closedIssue(headers, owner, repo, issue_number);
      res.status(200).json({ message: "SUCCESS" });
      break;

    default:
      break;
  }
}
