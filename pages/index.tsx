import NavBar from "@/components/NavBar";
import ToolBar from "@/components/ToolBar";
import FilterBar from "@/components/FilterBar";
import IssuesList from "@/components/IssuesList";
import Issue from "@/types/Issue";
import UserData from "@/types/UserData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { MouseEvent, UIEvent, useMemo, useRef, useState } from "react";
import IssueModal from "@/components/IssueModal";
import ModalDetails from "@/types/ModalDetails";
import Button from "@/components/Button";

const GitHubApiUrl = "https://api.github.com";

const fetchIssues = async (query: string, page: Number = 1) => {
  const res = await fetch(`api/issues?q=${query}&page=${page}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });
  return await res.json();
};

export const getServerSideProps: GetServerSideProps<{
  userData?: UserData;
}> = async (context) => {
  const accessToken = context.req.cookies.accessToken;
  if (!accessToken) return { props: {} };

  const userResponse = await fetch(`${GitHubApiUrl}/user`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const userData = await userResponse.json();
  return { props: { userData: userData } };
};

const Index = ({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");

  const queryRef = useRef("");
  const pageRef = useRef(1);
  const modalDetailsRef = useRef<ModalDetails>({
    modalTitle: "New Issue",
    owner: "",
    repo: "",
    issueTitle: "",
    body: "",
    labels: [],
    method: "POST",
  });

  const filteredIssues = useMemo(
    () =>
      filter
        ? issues.filter((issue) =>
            issue.labels.some((label) =>
              label.name.toLowerCase().includes(filter.toLowerCase())
            )
          )
        : issues,
    [issues, filter]
  );

  const submitQuery = async (queryInput: string) => {
    const Q = encodeURIComponent(
      `${queryInput} is:issue author:${userData?.login}`
    );
    const issuesData = await fetchIssues(Q);
    console.log(issuesData);

    queryRef.current = Q;
    setIssues(() => issuesData.items satisfies Issue[]);
    setFilter(() => "");
    pageRef.current = 1;
  };

  const updateFilter = (newFilter: string) => {
    if (!newFilter || newFilter === filter) return;
    setFilter(() => newFilter);
    console.log(filter);
    console.log(filteredIssues);
  };

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    if (!queryRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    console.log({ scrollHeight, scrollTop, clientHeight });
    const atBottom = scrollHeight - scrollTop === clientHeight;
    if (!atBottom) return;

    console.log("We are at the bottom of the lists");
    pageRef.current++;
    const moreIssuesData = await fetchIssues(queryRef.current, pageRef.current);
    setIssues((currentIssues) =>
      currentIssues.concat(moreIssuesData.items satisfies Issue[])
    );
  };

  const initIssueModal = (modalDetails?: ModalDetails) => {
    if (!modalDetails) {
      modalDetailsRef.current = {
        modalTitle: "New Issue",
        owner: "eesoymilk",
        repo: "dcard-frontend-intern-hw",
        issueTitle: "testing new issue",
        body: "This is me testing out my nextjs app's api that connects the GitHub api to create a new issue from my website. I hope this works...",
        labels: ["done", "in-progress", "open"],
        method: "POST",
      };
    } else {
      modalDetailsRef.current = modalDetails;
    }
    setShowModal(() => true);
  };

  return (
    <div className="flex flex-col h-screen bg-github-gray-dark">
      <NavBar userData={userData} />
      <main className="flex-grow overflow-y-scroll" onScroll={handleScroll}>
        {userData ? (
          <>
            <ToolBar
              submitQuery={submitQuery}
              updateFilter={updateFilter}
              initIssueModal={initIssueModal}
            />
            <IssueModal
              showModal={showModal}
              closeModal={() => {
                setShowModal(() => false);
              }}
              modalDetails={modalDetailsRef.current}
            />
            <IssuesList
              issues={filteredIssues}
              initIssueModal={initIssueModal}
            />
          </>
        ) : (
          <>
            <p>You must login first!</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
