// @ts-nocheck
import {
  LightBulb,
  LightBulbFilled,
  Profile,
  Saved,
  Settings,
} from "@assets/svgs/index";
import { DropdownMenu } from "@components/DropdownMenu";
import { Footer } from "@components/Footer";
import { css } from "@emotion/react";
import { Menu } from "@headlessui/react";
import { Switch } from "@material-ui/core";
import { UserType } from "@models/User";
import {
  AvatarWrapper,
  Button,
  elipsisText,
  menuCaretUserVariant,
  menuItemsUserVariant,
  mQ,
  StyledMenuItem,
} from "@styled";
import { signOut } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import * as React from "react";
import { useTheme } from "utils/hooks/useTheme";

interface Props {
  user: UserType | undefined;
}

export const UserMenu: React.FC<Props> = ({ user }) => {
  const [open, setOpen] = React.useState(false);

  const [theme, toggleTheme] = useTheme();

  const { push } = useRouter();

  return (
    <div css={{ position: "relative", display: "flex" }}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        css={{
          border: 0,
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <AvatarWrapper
          width="24px"
          height="24px"
          css={{
            [mQ("mobile")]: {
              display: "flex",
            },
          }}
        >
          {open ? (
            <div
              css={{
                position: "absolute",
                width: "30px",
                height: "30px",
                top: "-3px",
                left: "-3px",
                borderRadius: 9999,
                right: 0,
                bottom: 0,
                border: "1px solid var(--primary-text-color)",
              }}
            />
          ) : null}
          {user && user.image ? (
            <Image
              src={user.image}
              objectFit="contain"
              layout="fill"
              alt="userAvatar"
              css={{
                borderRadius: 9999,
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            />
          ) : null}
        </AvatarWrapper>
      </div>
      {open ? (
        <DropdownMenu
          closeMenu={() => setOpen(false)}
          style={{ menu: menuItemsUserVariant, caret: menuCaretUserVariant }}
          isControlled={open}
        >
          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                active={active}
                onClick={() => {
                  setOpen(false);

                  push(`/${user.username}`);
                }}
              >
                <Profile
                  strokeWidth="1px"
                  stroke="var(--primary-text-color)"
                  width="20px"
                  height="20px"
                  fill="var(--primary-text-color)"
                />
                <span
                  css={css`
                    margin-left: 10px;
                    ${elipsisText};
                  `}
                >
                  Profile
                </span>
              </StyledMenuItem>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                active={active}
                onClick={() => {
                  push(`/${user.username}/settings/edit`);

                  setOpen(false);
                }}
              >
                <Settings
                  width="20px"
                  height="20px"
                  fill="var(--primary-text-color)"
                />
                <span
                  css={css`
                    margin-left: 10px;
                    ${elipsisText};
                  `}
                >
                  Settings
                </span>
              </StyledMenuItem>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                active={active}
                css={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <Saved
                  width="20px"
                  height="20px"
                  fill="var(--primary-text-color)"
                />
                <span
                  css={css`
                    margin-left: 10px;
                    ${elipsisText};
                  `}
                >
                  Saved
                </span>
              </StyledMenuItem>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                active={active}
                css={{ borderBottom: "1px solid var(--border-color)" }}
              >
                {theme === "light" ? (
                  <LightBulbFilled
                    width="20px"
                    height="20px"
                    fill="var(--primary-text-color)"
                  />
                ) : (
                  <LightBulb
                    width="20px"
                    height="20px"
                    fill="var(--primary-text-color)"
                  />
                )}
                <span
                  css={css`
                    margin-left: 10px;
                    ${elipsisText};
                  `}
                >
                  {theme === "light" ? "Dim" : "Default"}
                </span>
                <Switch
                  checked={theme === "dark"}
                  onChange={toggleTheme}
                ></Switch>
              </StyledMenuItem>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                danger
                onClick={() => {
                  signOut();
                }}
                active={active}
              >
                Log out
              </StyledMenuItem>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <StyledMenuItem
                active={active}
                css={{
                  "@media screen and (min-width: 600px)": {
                    display: "none",
                  },
                }}
              >
                <Button active={false} onClick={() => setOpen(false)}>
                  <span>Cancel</span>
                </Button>
              </StyledMenuItem>
            )}
          </Menu.Item>
          <Menu.Item>
            <div
              css={{
                display: "none",
                [mQ("mobileLarge")]: {
                  display: "flex",
                },
                [mQ("mobile")]: {
                  display: "flex",
                },
              }}
            >
              <Footer />
            </div>
          </Menu.Item>
        </DropdownMenu>
      ) : null}
    </div>
  );
};
