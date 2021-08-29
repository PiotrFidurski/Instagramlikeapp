import { BottomNavbar } from "@components/BottomNavbar";
import { TopNavbar } from "@components/TopNavBar";
import { useRouter } from "next/router";

const NavBar: React.FC = () => {
  const { pathname } = useRouter();

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
