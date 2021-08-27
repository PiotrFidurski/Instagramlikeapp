import { api } from "@api/index";
import { CommentType } from "@models/Comment";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginatedResult } from "utils/types";

export const useLikeComment = ({
  comment,
  queryKeys,
}: {
  comment: CommentType | undefined;
  queryKeys: string[];
}) => {
  const queryClient = useQueryClient();

  const [postId, threadId] = queryKeys;

  return useMutation(() => api.comments.like({ commentId: comment!._id }), {
    onMutate: () => {
      const updateDeeplyNested = (c: CommentType) => {
        c.replies?.map((child) => {
          if (child._id === comment!._id) {
            child.isLiked = !child.isLiked;
            child.likesCount = child.isLiked
              ? child.likesCount + 1
              : child.likesCount - 1;
          }
          updateDeeplyNested(child);
        });
      };
      const currentComments:
        | InfiniteData<PaginatedResult<CommentType>>
        | undefined = queryClient.getQueryData(["comments", postId, threadId]);
      queryClient.setQueryData(
        ["comments", postId, threadId],
        (data: InfiniteData<PaginatedResult<CommentType>> | undefined) => ({
          ...data!,
          pages: data!.pages!.map((page) => ({
            ...page!,
            pages: page.pages!.filter((c) => {
              if (c._id === comment!._id) {
                c.isLiked = !c.isLiked;
                c.likesCount = c.isLiked ? c.likesCount + 1 : c.likesCount - 1;
              } else {
                updateDeeplyNested(c);
              }
              return c;
            }),
          })),
        })
      );
      return { currentComments };
    },
    onError: (err, newData, context) => {
      queryClient.setQueriesData(
        ["comments", postId, threadId],
        context?.currentComments
      );
    },
  });
};
