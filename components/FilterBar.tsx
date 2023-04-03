import { FormEvent, useRef } from "react";

export default function FilterBar({
  updateFilter,
}: {
  updateFilter: (newFilter: "open" | "closed") => void;
}) {
  const handleClick = () => {};
  const filteredButtons = ["open", "closed"].map((option) => (
    <>
      <button
        key={option}
        type="button"
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        onClick={handleClick}
      >
        {option}
      </button>
    </>
  ));
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className="inline-flex shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          role="group"
        >
          {filteredButtons}
        </div>
      </div>
    </>
  );
}
