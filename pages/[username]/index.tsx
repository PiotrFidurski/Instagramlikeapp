import { api } from "@api/index";
import { Camera } from "@assets/svgs/index";
import { useModal } from "@components/Modals/ModalComposition/context";
import { rowItem, UserPosts } from "@components/UserPosts";
import { css } from "@emotion/react";
import { Skeleton } from "@material-ui/lab";
import { PostType } from "@models/Post";
import { UserType } from "@models/User";
import { AvatarWrapper, Button, elipsisText, mQ, Spinner } from "@styled";
import format from "date-fns/format";
import { useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "react-query";
import { useFollowUser } from "utils/hooks/useFollowUser";

const row = css`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
`;

interface Props {}

const UserPage: React.FC<Props> = () => {
  const router = useRouter();

  const [session, loading] = useSession();

  const { setModal } = useModal();

  const { data: user } = useQuery<UserType>(
    ["user", router.query.username],
    () =>
      api.users.getUserByUsername({
        username: router.query.username as string,
      }),
    { enabled: !!router.query.username }
  );

  const { data: posts, isLoading } = useQuery<Array<PostType>>(
    ["userPosts", user?._id],
    () => api.posts.getUserPosts({ userId: user?._id as string }),
    { enabled: !!user }
  );

  React.useEffect(() => {
    if (router.query.postId) {
      setModal((modal) => ({ ...modal, key: "POST_MODAL", open: true }));
    }
    return () =>
      setModal((modal) => ({ ...modal, key: "POST_MODAL", open: false }));
  }, [router]);

  React.useEffect(() => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    }
  }, []);

  const { mutate } = useFollowUser({ user: user! });

  if (!user)
    return (
      <div
        css={{
          maxWidth: "350px",
          margin: "0 auto",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );

  return (
    user && (
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "935px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          css={{
            alignItems: "flex-start",
            display: "flex",
            marginBottom: "20px",
            [mQ("mobileSmall")]: {
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "stretch",
            },
            [mQ("mobile")]: { padding: "20px" },
          }}
        >
          <div
            css={{
              display: "flex",
              position: "relative",
              maxWidth: "150px",
              width: "100%",
              [mQ("mobileSmall")]: {
                maxWidth: "100px",
              },
            }}
          >
            <AvatarWrapper width="100%" height="100%">
              <Image
                src={user?.image as string}
                objectFit="contain"
                width="100%"
                height="100%"
                layout="responsive"
              />
            </AvatarWrapper>
          </div>
          <div
            css={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "15px",
              maxWidth: "300px",
              flexGrow: 1,
              [mQ("mobileSmall")]: { marginLeft: 0 },
            }}
          >
            <div
              css={{
                display: "flex",
                marginBottom: "10px",
                flexGrow: 1,
                justifyContent: "space-between",
                alignItems: "center",
                [mQ("mobile")]: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "stretch",
                },
              }}
            >
              <div
                css={{
                  minWidth: "0px",
                  display: "flex",
                  flexGrow: 1,
                  marginRight: "10px",
                  maxWidth: "200px",
                }}
              >
                <span
                  css={css`
                    ${elipsisText};
                    font-size: 17px;
                    color: var(--primary-text-color);
                    font-weight: 600;
                  `}
                >
                  {user?.username}
                </span>
              </div>
              <div css={{ display: "flex" }}>
                {loading ? (
                  <div
                    css={{
                      height: "31px",
                      width: "110px",
                      "> span": { transform: "unset !important" },
                    }}
                  >
                    <Skeleton variant="text" />
                  </div>
                ) : session?.user?._id === user?._id ? (
                  <Link href={`/${session?.user?.username}/settings`}>
                    <Button
                      active={true}
                      css={{
                        [mQ("mobile")]: { marginTop: "10px" },
                      }}
                    >
                      <span css={elipsisText}>Edit Profile</span>
                    </Button>
                  </Link>
                ) : session?.user?._id !== user?._id ? (
                  <Button
                    active={!!user?.isFollowed}
                    onClick={() => mutate()}
                    css={{
                      [mQ("mobile")]: { marginTop: "10px" },
                    }}
                  >
                    <span css={elipsisText}>
                      {user?.isFollowed ? "Following" : "Follow"}
                    </span>
                  </Button>
                ) : null}
              </div>
            </div>
            <div css={{ marginBottom: "10px", wordBreak: "break-word" }}>
              <span
                css={{ color: "var(--secondary-text-color)", fontSize: 14 }}
              >
                {user?.bio}
              </span>
            </div>
            <div css={{ marginBottom: "10px", marginTop: "" }}>
              <span css={{ color: "var(--tertiary-text-color)", fontSize: 14 }}>
                Joined, {format(new Date(user?.createdAt!), "dd, LLLL, yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div
          css={{
            justifyContent: "center",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginBottom: "15px",
          }}
        >
          <div
            css={{
              display: "flex",
              flexGrow: 1,
              height: 1,
              borderBottom: "1px solid var(--border-color)",
            }}
          />
          <div
            css={{
              display: "flex",
              alignSelf: "center",
              width: "70px",
              borderTop: "1px solid var(--secondary-text-color)",
              marginTop: "-1px",
              justifyContent: "center",
            }}
          >
            <Camera
              width="20px"
              height="20px"
              fill="var(--secondary-text-color)"
              css={{ margin: "5px 5px 0 0" }}
            />
            <span
              css={{
                color: "var(--secondary-text-color)",
                fontSize: 15,
                marginTop: "5px",
              }}
            >
              Posts
            </span>
          </div>
        </div>
        <div
          css={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {isLoading ? (
            <div css={row}>
              {Array(12)
                .fill(null)
                .map((el, index) => (
                  <div
                    key={index}
                    css={css`
                      ${rowItem};
                      position: relative;
                      color: white;
                      margin-right: ${index % 3 === 3 - 1 ? "0" : "1.5%"};
                      > span {
                        transform: unset !important;
                      }
                    `}
                  >
                    <Skeleton variant="rect" />
                    <Image
                      src={"/"}
                      layout="responsive"
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div css={row}>
              {posts?.map((post, index: number) => (
                <UserPosts index={index} post={post} key={post._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default UserPage;
