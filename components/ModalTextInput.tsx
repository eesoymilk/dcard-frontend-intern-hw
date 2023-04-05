import ModalDetails from "@/types/ModalDetails";
import { FormEvent, useState } from "react";
import { MdClose } from "react-icons/md";

const ModalTextInput = ({
  disabled,
  label,
  defaultValue,
}: {
  disabled?: boolean;
  label: string;
  defaultValue: string;
}) => (
  <div className="w-full">
    <label htmlFor={label} className="hidden">
      {label}
    </label>
    <input
      id={label}
      disabled={disabled}
      name={label}
      type="text"
      defaultValue={defaultValue}
      className="w-full m-0 p-2 block rounded-l border border-solid border-gray bg-neutral-200 disabled:bg-github-gray-light"
    />
  </div>
);

export default ModalTextInput;
