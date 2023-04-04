import Issue from "@/types/Issue";
import Button from "./Button";
import ModalDetails from "@/types/ModalDetails";
import { MdOutlineMoreHoriz, MdOutlineEdit } from "react-icons/md";
import { useRouter } from "next/router";

const GitHubApiUrl = "https://api.github.com";

const IssuesCard = ({
  issue,
  initIssueModal,
}: {
  issue: Issue;
  initIssueModal: (modalDetails?: ModalDetails) => void;
}) => {
  const router = useRouter();
  const [owner, repo, _, issue_number] = issue.url
    .replace(`${GitHubApiUrl}/repos/`, "")
    .split("/");
  const modalDetails = {
    modalTitle: "Edit Issue",
    owner,
    repo,
    issue_number: parseInt(issue_number),
    issueTitle: issue.title,
    body: issue.body,
    labels: issue.labels.map((label) => label.name),
    method: "PATCH",
  } satisfies ModalDetails;
  const labelChips = issue.labels.map((label) => (
    <div
      key={label.id}
      className={`bg-[#${label.color}] border-github-gray-light border-[1px] center relative inline-block select-none whitespace-nowrap rounded-full py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-neutral-200`}
    >
      {label.name}
    </div>
  ));

  return (
    <li key={issue.id} className="flex justify-center items-center gap-4">
      <div className="block max-w-sm rounded-lg bg-gray-dark border-2 border-gray p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-medium leading-tight text-neutral-50">
          {issue.title}
        </h2>
        <h3 className="mb-2 text-l font-medium leading-tight text-github-gray-light">
          {issue.url.replace(`${GitHubApiUrl}/repos`, "").split("/issues/")[0]}
        </h3>
        {labelChips.length ? (
          <div className="flex justify-start items-center gap-4 my-4">
            {labelChips}
          </div>
        ) : null}
        <p className="mb-4 text-base text-neutral-200">{issue.body}</p>
        <div className="flex justify-between items-center">
          <Button
            value="More"
            icon={<MdOutlineMoreHoriz size="1.25rem" className="mx-1" />}
            onClick={() => {
              router.push(issue.url.replace(`${GitHubApiUrl}/repos`, ""));
            }}
          />
          <Button
            value="Edit"
            icon={<MdOutlineEdit size="1.25rem" className="mx-1" />}
            onClick={() => {
              initIssueModal(modalDetails);
            }}
          />
        </div>
      </div>
    </li>
  );
};

export default IssuesCard;
