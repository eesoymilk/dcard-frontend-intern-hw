import ModalDetails from "@/types/ModalDetails";
import { FormEvent, useState } from "react";
import { MdClose } from "react-icons/md";
import ModalTextInput from "./ModalTextInput";
import { useRouter } from "next/router";

const IssueModal = ({
  showModal,
  closeModal,
  modalDetails,
}: {
  showModal: boolean;
  closeModal: () => void;
  modalDetails: ModalDetails;
}) => {
  const router = useRouter();
  const submitIssue = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { owner, repo, issueTitle, body, labels } = e.currentTarget;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const requestBody = {
      owner: owner.value as string,
      repo: repo.value as string,
      title: issueTitle.value as string,
      body: body.value as string,
      labels: (labels.value as string).split(",").map((s) => s.trim()),
    };

    console.table(requestBody);

    if (modalDetails.method === "POST") {
      fetch("/api/issues", {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
    } else {
      fetch("/api/issues", {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          issue_number: modalDetails.issue_number,
          ...requestBody,
        }),
      });
    }

    router.reload();
  };
  return (
    <>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-1/2 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <form
                onSubmit={submitIssue}
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-light"
              >
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h2 className="text-3xl font-semibold">
                    {modalDetails.modalTitle}
                  </h2>
                  <button
                    title="close modal"
                    className="p-1 ml-auto bg-transparent border-0 text-red float-right text-3xl "
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    <MdClose size="2rem" />
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="basis-1/5">owner/repo</h3>
                    <ModalTextInput
                      label="owner"
                      defaultValue={modalDetails.owner}
                    />
                    <ModalTextInput
                      label="repo"
                      defaultValue={modalDetails.repo}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <h3 className="basis-1/5">Title</h3>
                    <ModalTextInput
                      label="issueTitle"
                      defaultValue={modalDetails.issueTitle}
                    />
                  </div>
                  <div>
                    <h3>Body</h3>
                    <label htmlFor="body" className="hidden">
                      Body
                    </label>
                    <textarea
                      id="body"
                      name="body"
                      defaultValue={modalDetails.body}
                      className="w-full m-0 p-2 block rounded-l border border-solid border-gray bg-neutral-200"
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <h3 className="basis-1/5">Labels</h3>
                    <div className="flex-1">
                      <ModalTextInput
                        label="labels"
                        defaultValue={modalDetails.labels.join(",")}
                      />
                    </div>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default IssueModal;
