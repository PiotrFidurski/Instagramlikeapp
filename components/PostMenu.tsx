// @ts-nocheck
import { Menu } from "@headlessui/react";
import { PostType } from "@models/Post";
import {
  elipsisText,
  menuCaretPostVariant,
  menuItemsPostVariant,
  StyledMenuItem,
} from "@styled";
import { useSession } from "next-auth/client";
import Link from "next/link";
import * as React from "react";
import { useFollowUser } from "utils/hooks/useFollowUser";
import { useAlert } from "./Alerts/AlertComposition/context";
import { DropdownMenu } from "./DropdownMenu";
import { useModal } from "./Modals/ModalComposition/context";

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostType;
}

export const PostMenu: React.FC<Props> = ({ ...props }) => {
  const [session] = useSession();

  const { setActive, post } = props;

  const { createAlert } = useAlert();

  const { mutate } = useFollowUser({ user: post.owner });

  const { setModal } = useModal();

  return (
    <DropdownMenu
      isControlled={true}
      closeMenu={() => setActive(false)}
      style={{
        menu: menuItemsPostVariant,
        caret: menuCaretPostVariant,
      }}
    >
      <Menu.Item>
        {({ active }) => (
          <StyledMenuItem active={active} css={{ padding: 0 }}>
            <Link href={`/posts/${post._id}`}>
              <a css={{ display: "flex", flexGrow: 1, padding: "16px" }}>
                Go to post
              </a>
            </Link>
          </StyledMenuItem>
        )}
      </Menu.Item>
      {session?.user?._id !== post.owner._id ? (
        <Menu.Item>
          {({ active }) => (
            <StyledMenuItem
              active={active}
              css={{ padding: "16px" }}
              onClick={() => {
                mutate();
                createAlert("action", {
                  timeout: 7000,
                  onUndo: () => mutate(),
                  isActive: post?.owner?.isFollowed!,
                  value: post.owner.username,
                });
                setActive(false);
              }}
            >
              <span css={elipsisText}>
                {post.owner.isFollowed
                  ? `Unfollow ${post.owner.username}`
                  : `Follow ${post.owner.username}`}
              </span>
            </StyledMenuItem>
          )}
        </Menu.Item>
      ) : null}
      {session?.user?._id === post.owner._id ? (
        <Menu.Item>
          {({ active }) => (
            <StyledMenuItem active={active} css={{ padding: 0 }}>
              <div
                css={{ padding: "16px", width: "100%" }}
                onClick={() => {
                  setModal((modal) => ({
                    ...modal,
                    open: true,
                    key: "DELETE_POST",
                    props: { post },
                  }));
                }}
              >
                Delete
              </div>
            </StyledMenuItem>
          )}
        </Menu.Item>
      ) : null}
    </DropdownMenu>
  );
};
