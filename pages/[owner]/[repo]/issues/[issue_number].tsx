import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import Issue from "@/types/Issue";
import UserData from "@/types/UserData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { MdOutlineDelete } from "react-icons/md";
import { IoArrowUndo } from "react-icons/io5";
import { MouseEvent } from "react";

const GitHubApiUrl = "https://api.github.com";

export const getServerSideProps: GetServerSideProps<{
  userData?: UserData;
  issue?: Issue;
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

  const [userData, issue] = await Promise.all([
    userResponse.json(),
    issueResponse.json(),
  ]);

  return { props: { userData: userData, issue: issue } };
};

const IssueNumber = ({
  userData,
  issue,
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
    router.back();
  };

  const labelChips = issue?.labels.map((label) => (
    <div
      key={label.id}
      className={`bg-[#${label.color}] border-github-gray-light border-[1px] center relative inline-block select-none whitespace-nowrap rounded-full py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-neutral-200`}
    >
      {label.name}
    </div>
  ));

  return (
    <div className="flex flex-col h-screen bg-github-gray-dark">
      <NavBar userData={userData} />
      <main className="flex-grow overflow-y-scroll flex flex-col justify-start items-center">
        <div className="my-4 w-3/5 text-neutral-200">
          <h2 className="mb-2 text-xl font-medium leading-tight text-neutral-50">
            {issue?.title}
          </h2>
          <h3 className="mb-2 text-l font-medium leading-tight text-github-gray-light">
            {
              issue?.url
                .replace(`${GitHubApiUrl}/repos`, "")
                .split("/issues/")[0]
            }
          </h3>
          {labelChips?.length ? (
            <div className="flex justify-start items-center gap-4 my-4">
              {labelChips}
            </div>
          ) : null}
          <p className="mb-4 text-base text-neutral-200">{issue?.body}</p>
          <div className="flex justify-between">
            <Button
              value="Go Back"
              icon={<IoArrowUndo size="1.5rem" />}
              onClick={() => {
                router.back();
              }}
            />
            <Button
              value="Delete"
              icon={<MdOutlineDelete size="1.5rem" />}
              onClick={closeIssue}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueNumber;
