import { api } from "@api/index";
import { PostType } from "@models/Post";
import Link from "next/link";
import { useInfiniteLoader } from "utils/hooks/useInfiniteLoader";
import { Post } from "./PostComposition";
import { Content } from "./PostComposition/Content";
import { PostLoader } from "./PostLoader";

const Feed: React.FC = () => {
  const [{ data, isFetching, isLoading }, setElement] = useInfiniteLoader<
    PostType
  >("userFeed", api.posts.getUserFeed, { limit: 10 });

  if (!isLoading && !data?.pages?.[0]?.pages.length)
    return (
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          maxWidth: "600px",
          width: "100%",
          border: "1px solid var(--border-color)",
          color: "var(--primary-text-color)",
          alignItems: "center",
          borderRadius: "3px",
          background: "var(--container-background)",
          height: "100px",
          justifyContent: "center",
        }}
      >
        <span css={{ fontSize: "20px", fontWeight: 500 }}>
          There are no posts to display
        </span>
        <span>
          be first to create a post{" "}
          <Link href="/create">
            <a
              css={{
                color: "#01579b",
                "&:hover": { cursor: "pointer", textDecoration: "underline" },
              }}
            >
              here
            </a>
          </Link>
        </span>
      </div>
    );

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        maxWidth: "600px",
        width: "100%",
      }}
    >
      {data?.pages?.map((page) =>
        page?.pages?.map((post) => (
          <div key={post._id} ref={setElement}>
            <Post post={post} key={post._id} showSkeleton={false}>
              <Post.Header />
              <Post.Content>
                <Content.Image></Content.Image>
                <Content.Details></Content.Details>
              </Post.Content>
              <Post.Footer />
            </Post>
          </div>
        ))
      )}
      {isFetching ? (
        <>
          <PostLoader isLoading={true} />
          <PostLoader isLoading={true} />
          <PostLoader isLoading={true} />
        </>
      ) : null}
    </div>
  );
};

export { Feed };
