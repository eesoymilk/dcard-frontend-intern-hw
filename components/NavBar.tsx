import UserData from "@/types/UserData";
import { useRouter } from "next/router";

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
          w-full
          p-3
          items-center
          justify-between
          bg-neutral-900
          text-neutral-200
        "
    >
      {userData ? (
        <>
          <div>
            <p>Hi! {userData.login}.</p>
          </div>
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <div></div>
          <div>
            <a href={`${authUrl}?client_id=${CLIENT_ID}&scope=repo`}>
              Log in with GitHub
            </a>
          </div>
        </>
      )}
    </nav>
  );
}
