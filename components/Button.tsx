import Issue from "@/types/Issue";
import { MouseEvent, ReactNode } from "react";

export default function Button({
  value,
  icon,
  onClick,
}: {
  value: string;
  icon?: ReactNode;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      value={value}
      className="inline-flex justify-center items-center bg-gray hover:bg-gray-light active:bg-gray-light text-neutral-200 font-semibold hover:text-white py-2 px-2 rounded"
      onClick={onClick}
    >
      {icon}
      <p>{value}</p>
    </button>
  );
}
