import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import Issue from "@/types/Issue";
import UserData from "@/types/UserData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { MouseEvent } from "react";

const GitHubApiUrl = "https://api.github.com";

export const getServerSideProps: GetServerSideProps<{
  userData?: UserData;
  issueData?: Issue;
}> = async (context) => {
  const accessToken = context.req.cookies.accessToken;
  if (!accessToken) return { props: {} };

  const { owner, repo, issue_number } = context.query;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const [userResponse, issueResponse] = await Promise.all([
    fetch(`${GitHubApiUrl}/user`, { headers: headers }),
    fetch(`${GitHubApiUrl}/repos/${owner}/${repo}/issues/${issue_number}`, {
      headers: headers,
    }),
  ]);

  const [userData, issueData] = await Promise.all([
    userResponse.json(),
    issueResponse.json(),
  ]);

  return { props: { userData: userData, issueData: issueData } };
};

const IssueNumber = ({
  userData,
  issueData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { owner, repo, issue_number } = router.query;
  const closeIssue = async () => {
    const res = await fetch("/api/issues", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner,
        repo,
        issue_number: parseInt(issue_number as string),
      }),
    });
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar userData={userData} />
      <main>
        <h2>{issueData?.title}</h2>
        <p>{issueData?.body}</p>
        <Button
          value="Go Back"
          onClick={() => {
            router.push("/");
          }}
        />
        <Button value="Go Back" onClick={closeIssue} />
      </main>
    </div>
  );
};

export default IssueNumber;
