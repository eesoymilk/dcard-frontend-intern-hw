import Issue from "./Issue";

type IssueData = {
  total_count: number;
  incomplete_results: boolean;
  items: Issue[];
};

export default IssueData;
