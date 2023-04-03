import { FormEvent, useRef } from "react";

export default function SearchBar({
  submitQuery,
}: {
  submitQuery: (queryInput: string) => void;
}) {
  const queryInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!queryInputRef.current) return;
    submitQuery(queryInputRef.current.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="query">Query</label>
      <input id="query" ref={queryInputRef} />
      <button title="Search Issues" type="submit">
        Search
      </button>
    </form>
  );
}
