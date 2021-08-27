import { api } from "@api/index";
import { UserType } from "@models/User";
import { InfiniteData, useMutation, useQueryClient } from "react-query";
import { PaginatedResult } from "utils/types";

export const useFollowUser = ({ user }: { user: UserType | undefined }) => {
  const queryClient = useQueryClient();
  const userId = user?._id!;
  return useMutation(() => api.users.follow({ userId }), {
    onSuccess: (data) => {
      queryClient.invalidateQueries("userFeed");
    },
    onMutate: async () => {
      await queryClient.cancelQueries("nonPaginatedSuggestedUsers");
      await queryClient.cancelQueries("suggestedUsers");
      await queryClient.cancelQueries(["user", user?.username]);
      const previousUser = queryClient.getQueryData(["user", user?.username]);
      const previousUsers = queryClient.getQueryData(
        "nonPaginatedSuggestedUsers"
      );
      const previousPaginatedUsers = queryClient.getQueryData("suggestedUsers");

      if (previousUser) {
        queryClient.setQueryData(
          ["user", user?.username],
          (old: UserType | undefined) => ({
            ...old!,
            followersCount: user?.isFollowed
              ? old?.followersCount! + 1
              : old?.followersCount! - 1,
            isFollowed: user?.isFollowed ? false : true,
          })
        );
      }
      if (previousPaginatedUsers) {
        queryClient.setQueryData(
          "suggestedUsers",
          (old: InfiniteData<PaginatedResult<UserType>> | undefined) => ({
            ...old!,
            ...old?.pages!.map((page) => {
              page.pages?.filter((u: UserType) => {
                if (u._id === userId) {
                  u.isFollowed = user?.isFollowed ? false : true;
                  u.followersCount = user?.isFollowed
                    ? u.followersCount + 1
                    : u.followersCount - 1;
                  return u;
                }
                return u;
              });
            }),
          })
        );
      }
      if (previousUsers) {
        queryClient.setQueryData(
          "nonPaginatedSuggestedUsers",
          (old: PaginatedResult<UserType> | undefined) => {
            return {
              ...old!,
              pages: [...old?.pages!].filter((u) => {
                if (u._id === userId) {
                  u.isFollowed = user?.isFollowed ? false : true;
                  u.followersCount = user?.isFollowed
                    ? u.followersCount + 1
                    : u.followersCount - 1;
                  return u;
                }
                return u;
              }),
            };
          }
        );
      }

      return { previousUser, previousUsers, previousPaginatedUsers };
    },
  });
};
