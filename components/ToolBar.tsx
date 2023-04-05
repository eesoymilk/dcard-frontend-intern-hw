import { GoSearch, GoPlus } from "react-icons/go";
import { HiOutlineFilter } from "react-icons/hi";
import InputFieldWithIcon from "./InputFieldWithIcon";
import ModalDetails from "@/types/ModalDetails";
import Button from "./Button";
import { useRouter } from "next/router";

const ToolBar = ({
  updateFilter,
  initIssueModal,
}: {
  updateFilter: (newFilter: string) => void;
  initIssueModal: (modalDetails?: ModalDetails) => void;
}) => {
  const router = useRouter();
  const handleSearch = (newQuery: string) => {
    const { q } = router.query;
    console.table({ q, newQuery });
    if (newQuery === q || (q === undefined && newQuery === "")) return;
    if (newQuery === "") router.push("/");

    router.push(`/?q=${newQuery}`);
  };
  return (
    <div className="flex justify-center items-center bg-transparent">
      <InputFieldWithIcon
        label="search"
        submitForm={handleSearch}
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
};

export default ToolBar;
