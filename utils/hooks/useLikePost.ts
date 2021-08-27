import { api } from "@api/index";
import { PostType } from "@models/Post";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginatedResult } from "utils/types";

export const useLikePost = ({ post }: { post: PostType | undefined }) => {
  const queryClient = useQueryClient();

  const postId = post?._id!;

  return useMutation(() => api.posts.like({ postId }), {
    onMutate: async () => {
      await queryClient.cancelQueries(["post", postId]);
      await queryClient.cancelQueries("posts");
      await queryClient.cancelQueries("userFeed");
      const previousPost = queryClient.getQueryData(["post", postId]);
      const previousPosts = queryClient.getQueryData("posts");
      const previousFeed = queryClient.getQueryData("userFeed");
      if (previousPost) {
        queryClient.setQueryData(
          ["post", postId],
          (old: PostType | undefined) => ({
            ...old!,
            likesCount: post?.isLiked
              ? old?.likesCount! - 1
              : old?.likesCount! + 1,
            isLiked: post?.isLiked ? false : true,
          })
        );
      }

      if (previousFeed) {
        queryClient.setQueryData(
          "userFeed",
          (old: InfiniteData<PaginatedResult<PostType>> | undefined) => ({
            ...old!,
            ...old?.pages?.map((page) =>
              page.pages?.filter((p: PostType) => {
                if (p._id === postId) {
                  p.isLiked = post?.isLiked ? false : true;
                  p.likesCount = post?.isLiked
                    ? p.likesCount + 1
                    : p.likesCount - 1;
                  return p;
                }
                return p;
              })
            ),
          })
        );
      }

      return { previousPost, previousPosts };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["post", postId], context?.previousPost);
    },
  });
};
