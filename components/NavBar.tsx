import UserData from "@/types/UserData";
import { useRouter } from "next/router";
import { GoMarkGithub } from "react-icons/go";
import Button from "./Button";
import Link from "next/link";
import Image from "next/image";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const authUrl = "https://github.com/login/oauth/authorize";

export default function NavBar({ userData }: { userData?: UserData }) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout");
    router.reload();
  };
  return (
    <nav
      className="
          flex
          p-3
          items-center
          justify-between
          bg-github-black
          text-neutral-200
        "
    >
      <div className="flex justify-center items-center">
        <Link href="https://github.com" target="_blank">
          <GoMarkGithub
            size="2rem"
            className="hover:text-gray-light transition-all ease-in-out active:text-gray"
          />
        </Link>
      </div>
      <div className="flex justify-center items-center gap-4">
        {userData ? (
          <>
            <p>Signed in as {userData.login}</p>
            <Image
              src={userData.avatar_url}
              alt={userData.login}
              width={32}
              height={32}
              className="rounded-full"
            />
            <Button value="Logout" onClick={logout} />
          </>
        ) : (
          <>
            <p>You must log in first</p>
            <Button
              value="Login"
              onClick={() => {
                router.push(`${authUrl}?client_id=${CLIENT_ID}&scope=repo`);
              }}
            />
          </>
        )}
      </div>
    </nav>
  );
}
