import { api } from "@api/index";
import { UserType } from "@models/User";
import { mQ } from "@styled";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { useQuery } from "react-query";
import { useRedirectUnauthorized } from "utils/hooks/useRedirectUnauthorized";
import { data } from "../../../../utils/UserSettingsPage/data";
import { Container } from "../../../../utils/UserSettingsPage/styles";

interface Props {}

const Route: React.FC<Props> = () => {
  const router = useRouter();

  const [_, session, owner] = useRedirectUnauthorized({
    path: "/login",
  });

  const { data: user, isLoading } = useQuery<UserType>(
    ["user", router.query.username],
    () =>
      api.users.getUserByUsername({
        username: router.query.username as string,
      }),
    { enabled: !!router.query.username }
  );

  const findComponentForTheRoute = () =>
    data.find((cmp) => cmp.pathname === router.query.route);

  React.useEffect(() => {
    const possibleComponent = findComponentForTheRoute();

    if (router.query.route && !possibleComponent)
      router.push(`/${user?.username}/settings/edit`);
  }, [router]);

  if (isLoading || !session || !owner) return <></>;

  return (
    <>
      <div
        css={{
          color: "var(--primary-text-color)",
          display: "flex",
          flexGrow: 1,
          height: "100vh",
          background: "var(--container-background)",
          flexDirection: "column",
          border: "1px solid var(--border-color)",
          maxWidth: "300px",
          width: "100%",
          [mQ("mobile")]: {
            borderTop: 0,
            borderLeft: 0,
            maxWidth: "100%",
            display:
              router.pathname !== "/[username]/settings" ? "none" : "flex",
          },
        }}
      >
        {data.map((route) => (
          <Link
            href={`/${user?.username}/settings/${route.pathname}`}
            key={route.pathname}
          >
            <div
              key={route.pathname}
              css={{
                padding: "10px",
                borderBottom: "1px solid var(--border-color)",
                "&:hover": {
                  cursor: "pointer",
                  background: "var(--container-hover-background)",
                },
                background:
                  router.query.route === route.pathname
                    ? "var(--container-hover-background)"
                    : "transparent",
                borderLeft:
                  router.query.route === route.pathname
                    ? "3px solid rgb(29, 161, 242)"
                    : "3px solid transparent",
              }}
            >
              <span>{route.name}</span>
            </div>
          </Link>
        ))}
      </div>
      <div
        css={{
          display: "flex",
          flexGrow: 3,
          color: "var(--primary-text-color)",
        }}
      >
        {user
          ? findComponentForTheRoute()?.component({ user: user! }) || (
              <Container>
                <h1>User Settings</h1>
              </Container>
            )
          : null}
      </div>
    </>
  );
};

export default Route;
