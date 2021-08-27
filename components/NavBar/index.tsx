import { api } from "@api/index";
import { BottomNavbar } from "@components/BottomNavbar";
import { TopNavbar } from "@components/TopNavBar";
import { UserType } from "@models/User";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const NavBar: React.FC = () => {
  const { isLoading, data } = useQuery<UserType>("me", () => api.users.me(), {
    retry: false,
  });

  const { pathname } = useRouter();

  return (
    <div
      css={{
        display:
          pathname === "/login" || pathname === "/register" ? "none" : "flex",
      }}
    >
      <>
        {isLoading ? <></> : null}
        <>
          {data ? (
            <>
              <BottomNavbar user={data!} />
            </>
          ) : null}
          {data ? <TopNavbar user={data!} /> : null}
        </>
      </>
    </div>
  );
};

export { NavBar };
