import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import IssuesList from "@/components/IssuesList";
import Issue from "@/types/Issue";
import UserData from "@/types/UserData";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { UIEvent, useMemo, useRef, useState } from "react";

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

export default function Index({
  userData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [query, setQuery] = useState<string>("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState<"open" | "closed">();
  const pageRef = useRef<number>(1);
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => (filter ? issue.state === filter : true));
  }, [issues, filter]);

  const submitQuery = async (queryInput: string) => {
    const Q = encodeURIComponent(
      `${queryInput} is:issue author:${userData?.login}`
    );
    const issuesData = await fetchIssues(Q);

    setQuery(() => Q);
    setIssues(() => issuesData.items satisfies Issue[]);
    pageRef.current = 1;
  };

  const updateFiliter = (newFilter: "open" | "closed") => {
    setFilter((currentFilter) =>
      currentFilter === newFilter ? undefined : newFilter
    );
  };

  const handleScroll = async (e: UIEvent<HTMLDivElement>) => {
    if (!query) return;

    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    console.log({ scrollHeight, scrollTop, clientHeight });
    const atBottom = scrollHeight - scrollTop === clientHeight;
    if (!atBottom) return;

    console.log("We are at the bottom of the lists");
    pageRef.current++;
    const moreIssuesData = await fetchIssues(query, pageRef.current);
    setIssues((currentIssues) =>
      currentIssues.concat(moreIssuesData.items satisfies Issue[])
    );
  };

  return (
    <div className="max-h-screen overflow-y-scroll" onScroll={handleScroll}>
      <header>
        <NavBar userData={userData} />
      </header>
      <main>
        {userData ? (
          <>
            <SearchBar submitQuery={submitQuery} />
            <FilterBar updateFilter={updateFiliter} />
            <IssuesList issues={filteredIssues} />
          </>
        ) : (
          <>
            <p>You must login first!</p>
          </>
        )}
      </main>
    </div>
  );
}
