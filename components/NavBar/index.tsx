import { useAuth } from "@components/AuthContext/useAuth";
import { BottomNavbar } from "@components/BottomNavbar";
import { TopNavbar } from "@components/TopNavBar";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const [session] = useSession();
  const { user, loading } = useAuth();

  return (
    <div
      css={{
        display:
          pathname === "/login" || pathname === "/register" ? "none" : "flex",
      }}
    >
      <BottomNavbar />
      <TopNavbar />
    </div>
  );
};

export { NavBar };
