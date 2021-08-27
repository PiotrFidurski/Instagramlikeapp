import { UserType } from "@models/User";
import { navContainer, navContainerMobile, navItem, navWrapper } from "@styled";
import Link from "next/link";
import { useRouter } from "next/router";
import { paths } from "./data";

interface Props {
  user: UserType;
}

export const BottomNavbar: React.FC<Props> = ({ user }) => {
  const router = useRouter();

  return (
    <div css={[navContainer, navContainerMobile]}>
      <div css={navWrapper}>
        <div
          css={{
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
            flexGrow: 1,
            display: "flex",
          }}
        >
          {paths.map(({ render, href }, index: number) => (
            <div css={navItem} key={index}>
              <Link href={href === "/[username]" ? `/${user.username}` : href}>
                <a
                  css={{
                    display: "flex",
                    cursor: "pointer",
                    flexGrow: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {router.pathname === "/[username]"
                    ? router.query.username === user?.username
                      ? render({ ...user } as UserType).filledVariant
                      : render({ ...user } as UserType).regular
                    : router.pathname === href
                    ? render({ ...user } as UserType).filledVariant
                    : render({ ...user } as UserType).regular}
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
