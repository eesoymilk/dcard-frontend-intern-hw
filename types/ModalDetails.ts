type ModalDetails = {
  owner: string;
  repo: string;
  issue_number?: number;
  issueTitle: string;
  body: string;
  labels: string[];
};

export default ModalDetails;
