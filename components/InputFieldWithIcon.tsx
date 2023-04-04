import { FormEvent, useRef, ReactNode } from "react";

export default function InputFieldWithIcon({
  label,
  icon,
  submitForm,
}: {
  label: string;
  icon: ReactNode;
  submitForm: (queryInput: string) => Promise<void> | void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputRef.current) return;
    submitForm(inputRef.current.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center bg-transparent p-4"
    >
      <label htmlFor={label} className="text-white hidden">
        Query
      </label>
      <input
        id={label}
        ref={inputRef}
        className="m-0 p-2 block rounded-l border border-solid border-gray bg-gray-dark"
      />
      <button
        title={label}
        type="submit"
        className="z-[2] rounded-r bg-gray px-6 py-2.5 text-xs font-medium uppercase leading-tight text-neutral-200 shadow-md transition duration-150 ease-in-out hover:bg-gray-light hover:shadow-lg focus:bg-gray-light focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-light active:shadow-lg"
      >
        {icon}
      </button>
    </form>
  );
}
