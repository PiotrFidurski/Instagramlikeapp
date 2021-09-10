import { Plus } from "@assets/svgs/index";
import { useAuth } from "@components/AuthContext/useAuth";
import { SearchBar } from "@components/Searchbar";
import { Skeleton } from "@material-ui/lab";
import {
  Button,
  elipsisText,
  mQ,
  navItem,
  navItemCenter,
  navItemEnd,
  navItemStart,
} from "@styled";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";
import { SearchMenu } from "./SearchMenu";
import { UserMenu } from "./UserMenu";

export const Desktop: React.FC = () => {
  const { user, loading, sessionLoading, session } = useAuth();

  const { pathname, push } = useRouter();

  return (
    <div
      css={{
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "0 10px",
        [mQ("mobile")]: {
          display: "none",
        },
      }}
    >
      <div css={[navItem, navItemStart]}>
        <div onClick={() => push("/")}>
          <a
            css={{ height: "100%", cursor: "pointer" }}
            href="/https://scuffedinsta.vercel.app/"
          >
            <span
              css={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                letterSpacing: "2.5px",
                fontWeight: 600,
                color: "var(--primary-text-color)",
              }}
            >
              PictureFeed
            </span>
          </a>
        </div>
      </div>
      {pathname !== "/search" ? (
        <div css={[navItem, navItemCenter]}>
          <SearchBar>
            {({ ...props }) =>
              props.active ? <SearchMenu {...props} /> : <></>
            }
          </SearchBar>
        </div>
      ) : null}
      <div css={[navItem, navItemEnd]}>
        {loading ? (
          <div css={{ width: "24px", height: "24px", marginRight: "10px" }}>
            <Skeleton variant="circle" width="24px" />
          </div>
        ) : null}
        {!loading && user ? (
          <Link href="/create">
            <a css={{ display: "flex" }}>
              <Plus
                width="24px"
                height="24px"
                fill="var(--primary-text-color)"
                css={{ marginRight: "10px", "&:hover": { cursor: "pointer" } }}
              />
            </a>
          </Link>
        ) : null}
        {loading ? (
          <div css={{ width: "24px", height: "24px" }}>
            <Skeleton variant="circle" width="24px" />
          </div>
        ) : null}
        {!loading && user ? <UserMenu user={user} /> : null}
        {!user && !sessionLoading && !session ? (
          <div
            css={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-evenly",
              maxWidth: "200px",
            }}
          >
            <div css={{ maxWidth: "80px", width: "100%" }}>
              <Link href="/login">
                <a>
                  <Button active={true}>
                    <span css={elipsisText}>Log in</span>
                  </Button>
                </a>
              </Link>
            </div>
            <div css={{ maxWidth: "95px", width: "100%" }}>
              <Link href="/register">
                <a>
                  <Button active={true}>
                    <span css={elipsisText}>Register</span>
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
