import { CommentFilled, HeartFilled } from "@assets/svgs/index";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { PostType } from "@models/Post";
import { mQ } from "@styled";
import Image from "next/image";
import Link from "next/link";
import { usePalette } from "react-palette";

const Backdrop = styled.div`
  z-index: 3;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  left: 0;
  right: 0;
  bottom: 0;
  transition: all 0.1s ease-in;
  content: "asdsad";
  ${mQ("mobile")} {
    flex-direction: column;
    justify-content: center;
  }
  > div {
    display: none;
  }
`;

export const rowItem = css`
  flex-basis: calc(32.333333%);
  margin-bottom: 1.4%;
  margin-right: 1.4%;
  &:hover {
    cursor: pointer;
    ${Backdrop} {
      background: rgba(0, 0, 0, 0.2);
      > div {
        display: flex;
        align-items: center;
        ${mQ("mobile")} {
          padding: 2px;
        }
      }
    }
  }
`;

interface Props {
  index: number;
  post: PostType;
}

export const UserPosts: React.FC<Props> = ({ index, post }) => {
  const { data } = usePalette(post?.image?.thumb?.url!);

  return (
    <div
      css={css`
        ${rowItem};
        margin-right: ${index % 3 === 3 - 1 ? "0" : "1.5%"};
      `}
      key={post._id}
    >
      <Link
        href={`/[username]?username=${post.owner.username}&postId=${post._id}`}
        as={`/posts/${post._id}`}
        shallow
      >
        <div
          css={{
            position: "relative",
            background: data.darkVibrant,
          }}
        >
          <Backdrop>
            <div>
              <HeartFilled
                width="24px"
                height="24px"
                fill="white"
                css={{ marginRight: "5px" }}
              />
              <span
                css={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {post.likesCount}
              </span>
            </div>
            <div>
              <CommentFilled
                width="24px"
                height="24px"
                fill="white"
                css={{ marginRight: "5px" }}
              />
              <span
                css={{
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {post.commentsCount}
              </span>
            </div>
          </Backdrop>
          <Image
            src={post?.image?.thumb?.url!}
            layout="responsive"
            objectFit="cover"
            width="100%"
            alt="postThumbnail"
            height="100%"
          />
        </div>
      </Link>
    </div>
  );
};
