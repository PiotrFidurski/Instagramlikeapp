import { api } from "@api/index";
import { CommentType } from "@models/Comment";
import { useMutation, useQueryClient } from "react-query";

const useLoadMoreComments = ({
  comment,
  queryKeys,
}: {
  comment: CommentType | undefined;
  queryKeys: string[];
}) => {
  const queryClient = useQueryClient();

  const [postId, threadId] = queryKeys;

  return useMutation(
    "loadMore",
    () =>
      api.comments.loadMore({
        postId: comment!._id,
        sliceAt: comment!.replies.length,
        depth: comment!.depth,
      }),
    {
      onSuccess: (data) => {
        const updateDeeplyNested = (comment: any) => {
          comment.replies?.map((child: any) => {
            if (child._id === data[0].inReplyToCommentId) {
              child.replies?.push(...data);
            }
            updateDeeplyNested(child);
          });
        };
        if (data) {
          queryClient.setQueryData(
            ["comments", postId, threadId],
            (data_: any) => ({
              ...data_,
              pageParams: data_.pageParams,
              pages: [
                ...data_.pages.map((page: any) => {
                  return {
                    ...page,
                    pages: page.pages.filter((comment: any) => {
                      if (comment._id === data[0].inReplyToCommentId) {
                        comment.replies?.push(...data);
                      } else {
                        updateDeeplyNested(comment);
                      }
                      return comment;
                    }),
                  };
                }),
              ],
            })
          );
        }
      },
    }
  );
};

export { useLoadMoreComments };
