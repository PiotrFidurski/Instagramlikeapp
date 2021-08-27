import { ArrowLeft, Discover } from "@assets/svgs/index";
import { css } from "@emotion/react";
import { UserType } from "@models/User";
import {
  elipsisText,
  navItem,
  navItemCenter,
  navItemEnd,
  navItemStart,
} from "@styled";
import React from "react";
import { UserMenu } from "./UserMenu";

interface Props {
  user: UserType;
  onClick: () => void;
  query: NodeJS.Dict<string | string[]>;
  goTo: (path: string) => void;
}

interface Path {
  href: string;
  render: ({ user, onClick, query, goTo }: Props) => React.ReactElement;
}

const paths: Array<Path> = [
  {
    href: "/",
    render: ({ user }) => (
      <>
        <div css={[navItem, navItemStart]}>
          <span
            css={css`
              letter-spacing: 2.5px;
              font-weight: 600;
              color: var(--primary-text-color);
              ${elipsisText}
            `}
          >
            PictureFeed
          </span>
        </div>
        <div css={[navItem, navItemCenter]}></div>
        <div css={[navItem, navItemEnd]}>
          <UserMenu user={user} />
        </div>
      </>
    ),
  },
  {
    href: "/posts/[postId]" || "/posts/[postId]/thread/[threadId]",
    render: ({ onClick }) => {
      return (
        <>
          <div css={[navItem, navItemStart]}>
            <span
              css={css`
                letter-spacing: 2.5px;
                font-weight: 600;
                color: var(--primary-text-color);
                ${elipsisText}
              `}
            >
              Photo
            </span>
          </div>

          <div css={[navItem, navItemEnd]} onClick={onClick}>
            <ArrowLeft
              width="15px"
              height="15px"
              fill="var(--primary-text-color)"
            />
          </div>
        </>
      );
    },
  },
  {
    href: "/posts/[postId]/thread/[threadId]",
    render: ({ onClick }) => {
      return (
        <>
          <div css={[navItem, navItemStart]}>
            <span
              css={css`
                letter-spacing: 2.5px;
                font-weight: 600;
                color: var(--primary-text-color);
                ${elipsisText}
              `}
            >
              Thread
            </span>
          </div>

          <div css={[navItem, navItemEnd]} onClick={onClick}>
            <ArrowLeft
              width="15px"
              height="15px"
              fill="var(--primary-text-color)"
            />
          </div>
        </>
      );
    },
  },
  {
    href: "/[username]",
    render: ({ onClick: goBack, query, goTo }) => {
      return (
        <>
          <div
            onClick={() => goTo("/discover")}
            css={{
              display: "flex",
              justifyContent: "flex-end",
              height: "100%",
              alignItems: "center",
              width: "50px",
              ":hover": { cursor: "pointer" },
            }}
          >
            <Discover
              width="50px"
              height="20px"
              fill="var(--primary-text-color)"
            />
          </div>
          <div css={[navItem, navItemStart]} style={{ marginRight: 0 }}>
            <div
              css={{
                minWidth: "0px",
                maxWidth: "170px",
                display: "flex",
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              <span
                css={css`
                  letter-spacing: 2.5px;
                  font-weight: 600;
                  color: var(--primary-text-color);
                  ${elipsisText}
                `}
              >
                {query.username}
              </span>
            </div>
          </div>
          <div css={[navItem, navItemEnd]} onClick={goBack}>
            <ArrowLeft
              width="15px"
              height="15px"
              fill="var(--primary-text-color)"
            />
          </div>
        </>
      );
    },
  },
  {
    href: "/create",
    render: ({ onClick: goBack }) => (
      <>
        <div css={[navItem, navItemStart]}>
          <span
            css={css`
              letter-spacing: 2.5px;
              font-weight: 600;
              color: var(--primary-text-color);
              ${elipsisText}
            `}
          >
            Create
          </span>
        </div>

        <div css={[navItem, navItemEnd]} onClick={goBack}>
          <ArrowLeft
            width="15px"
            height="15px"
            fill="var(--primary-text-color)"
          />
        </div>
      </>
    ),
  },
  {
    href: "/discover",
    render: ({ onClick: goBack }) => (
      <>
        <div css={[navItem, navItemStart]}>
          <span
            css={css`
              letter-spacing: 2.5px;
              font-weight: 600;
              color: var(--primary-text-color);
              ${elipsisText}
            `}
          >
            Discover
          </span>
        </div>

        <div css={[navItem, navItemEnd]} onClick={goBack}>
          <ArrowLeft
            width="15px"
            height="15px"
            fill="var(--primary-text-color)"
          />
        </div>
      </>
    ),
  },
  {
    href: "/search",
    render: ({ onClick: goBack }) => (
      <>
        <div css={[navItem, navItemStart]}>
          <span
            css={css`
              letter-spacing: 2.5px;
              font-weight: 600;
              color: var(--primary-text-color);
              ${elipsisText}
            `}
          >
            Search
          </span>
        </div>

        <div css={[navItem, navItemEnd]} onClick={goBack}>
          <ArrowLeft
            width="15px"
            height="15px"
            fill="var(--primary-text-color)"
          />
        </div>
      </>
    ),
  },
  {
    href: "/[username]/settings",
    render: ({ onClick }) => {
      return (
        <>
          <div css={[navItem, navItemStart]}>
            <span
              css={css`
                letter-spacing: 2.5px;
                font-weight: 600;
                color: var(--primary-text-color);
                ${elipsisText}
              `}
            >
              Settings
            </span>
          </div>

          <div css={[navItem, navItemEnd]} onClick={onClick}>
            <ArrowLeft
              width="15px"
              height="15px"
              fill="var(--primary-text-color)"
            />
          </div>
        </>
      );
    },
  },
  {
    href: "/[username]/settings/[route]",
    render: ({ onClick, query }) => {
      return (
        <>
          <div css={[navItem, navItemStart]}>
            <span
              css={css`
                letter-spacing: 2.5px;
                font-weight: 600;
                color: var(--primary-text-color);
                ${elipsisText};
                :first-letter {
                  text-transform: capitalize;
                }
              `}
            >
              {query.route}
            </span>
          </div>

          <div css={[navItem, navItemEnd]} onClick={onClick}>
            <ArrowLeft
              width="15px"
              height="15px"
              fill="var(--primary-text-color)"
            />
          </div>
        </>
      );
    },
  },
];

const data: Record<string, Path> = {};

paths.forEach((path) => (data[path.href] = path));

export { data };
