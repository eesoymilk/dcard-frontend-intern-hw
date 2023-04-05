import NavBar from "@/components/NavBar";
import ToolBar from "@/components/ToolBar";
import IssuesList from "@/components/IssuesList";
import Issue from "@/types/Issue";
import UserData from "@/types/UserData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  MouseEvent,
  UIEvent,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import IssueModal from "@/components/IssueModal";
import ModalDetails from "@/types/ModalDetails";
import { useRouter } from "next/router";
import IssueData from "@/types/IssueData";
import Head from "next/head";

const GitHubApiUrl = "https://api.github.com";

const fetchIssues = async (
  query: string,
  page: Number = 1
): Promise<IssueData> => {
  console.table({ query, page });
  const res = await fetch(`api/issues?q=${query}&page=${page}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });
  return await res.json();
};

export const getServerSideProps: GetServerSideProps<{
  userData?: UserData;
  initialIssuesData?: IssueData;
}> = async (context) => {
  const accessToken = context.req.cookies.accessToken;
  if (!accessToken) return { props: {} };

  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const userResponse = await fetch(`${GitHubApiUrl}/user`, {
    headers,
  });
  const userData = await userResponse.json();

  const { q } = context.query;
  console.log(context.query);

  const Q = encodeURIComponent(`${q || ""} is:issue author:${userData?.login}`);
  console.log(Q);

  const initialIssuesResponse = await fetch(
    `${GitHubApiUrl}/search/issues?q=${Q}&per_page=10`,
    {
      headers,
    }
  );
  const initialIssuesData = await initialIssuesResponse.json();

  return { props: { userData, initialIssuesData } };
};

const Index = ({
  userData,
  initialIssuesData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const [issues, setIssues] = useState<Issue[]>(initialIssuesData?.items || []);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");

  const pageRef = useRef(1);
  const totalPageRef = useRef(
    Math.ceil(initialIssuesData?.total_count || 0 / 10)
  );
  const modalDetailsRef = useRef<ModalDetails>({
    owner: userData?.login || "",
    repo: "",
    issueTitle: "",
    body: "",
    labels: [],
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

  useEffect(() => {
    setIssues(() => initialIssuesData?.items || []);
    setFilter(() => "");
    pageRef.current = 1;
    totalPageRef.current = Math.ceil(
      (initialIssuesData?.total_count || 0) / 10
    );
  }, [initialIssuesData]);

  const updateFilter = (newFilter: string) => {
    if (!newFilter || newFilter === filter) return;
    setFilter(() => newFilter);
    console.log(filter);
    console.log(filteredIssues);
  };

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    if (pageRef.current >= totalPageRef.current) return;

    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    const atBottom = scrollHeight - scrollTop === clientHeight;

    if (!atBottom) return;

    const { q } = router.query;
    const Q = encodeURIComponent(
      `${q || ""} is:issue author:${userData?.login}`
    );
    const moreIssuesData = await fetchIssues(Q, ++pageRef.current);

    setIssues((currentIssues) => currentIssues.concat(moreIssuesData.items));
  };

  const initIssueModal = () => {
    modalDetailsRef.current = {
      owner: userData?.login || "",
      repo: "",
      issueTitle: "",
      body: "",
      labels: [],
    };
    setShowModal(() => true);
  };

  return (
    <>
      <Head>
        <title>Dcard Frontend Intern Homework</title>
      </Head>
      <div className="flex flex-col h-screen bg-github-gray-dark">
        <NavBar userData={userData} />
        <main className="flex-grow overflow-y-scroll" onScroll={handleScroll}>
          {userData ? (
            <>
              <ToolBar
                updateFilter={updateFilter}
                initIssueModal={initIssueModal}
              />
              <IssueModal
                isNew={true}
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
          ) : null}
        </main>
      </div>
    </>
  );
};

export default Index;
