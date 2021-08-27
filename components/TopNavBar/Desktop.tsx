import { Plus } from "@assets/svgs/index";
import { SearchBar } from "@components/Searchbar";
import { UserType } from "@models/User";
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

interface Props {
  user: UserType;
}

export const Desktop: React.FC<Props> = ({ user }) => {
  const { pathname, back, push } = useRouter();

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
        <div onClick={pathname !== "/" ? () => back() : () => push("/")}>
          <a css={{ height: "100%", cursor: "pointer" }}>
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
        {user ? <UserMenu user={user} /> : <div>asd</div>}
        {!user ? (
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
