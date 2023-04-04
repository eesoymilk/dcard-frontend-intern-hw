type ModalDetails = {
  modalTitle: string;
  owner: string;
  repo: string;
  issue_number?: number;
  issueTitle: string;
  body: string;
  labels: string[];
  method: "POST" | "PATCH";
};

export default ModalDetails;
