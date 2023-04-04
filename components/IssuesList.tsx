import Issue from "@/types/Issue";
import Button from "./Button";
import { useRouter } from "next/router";
import { MouseEvent } from "react";
import ModalDetails from "@/types/ModalDetails";
import IssuesCard from "./IssueCard";

const GitHubApiUrl = "https://api.github.com";

export default function IssuesList({
  issues,
  initIssueModal,
}: {
  issues: Issue[];
  initIssueModal: (modalDetails?: ModalDetails) => void;
}) {
  const router = useRouter();
  const issuesListItems = issues.map((issue) => (
    <IssuesCard key={issue.id} issue={issue} initIssueModal={initIssueModal} />
  ));

  return (
    <ul className="bg-transparent flex flex-col justify-center items-center gap-4 p-4">
      {issuesListItems}
    </ul>
  );
}
