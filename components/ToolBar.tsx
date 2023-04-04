import { GoSearch, GoPlus } from "react-icons/go";
import { HiOutlineFilter } from "react-icons/hi";
import InputFieldWithIcon from "./InputFieldWithIcon";
import ModalDetails from "@/types/ModalDetails";
import Button from "./Button";

const ToolBar = ({
  submitQuery,
  updateFilter,
  initIssueModal,
}: {
  submitQuery: (queryInput: string) => Promise<void>;
  updateFilter: (newFilter: string) => void;
  initIssueModal: (modalDetails?: ModalDetails) => void;
}) => (
  <div className="flex justify-center items-center bg-transparent">
    <InputFieldWithIcon
      label="search"
      submitForm={submitQuery}
      icon={<GoSearch size="1.5rem" />}
    />
    <InputFieldWithIcon
      label="filter"
      submitForm={updateFilter}
      icon={<HiOutlineFilter size="1.5rem" />}
    />

    <Button
      value="New Issue"
      icon={<GoPlus size="1.5rem" />}
      onClick={() => {
        initIssueModal();
      }}
    />
  </div>
);

export default ToolBar;
