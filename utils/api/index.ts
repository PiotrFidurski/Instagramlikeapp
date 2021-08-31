import { Fields, File } from "formidable";
import { Response } from "utils/types";
export interface PrasedForm {
  file: File | File[];
  fields: Fields;
}

export interface EagerTransformation {
  transformation: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  url: string;
  secure_url: string;
}

export interface CloudinaryResponse {
  eager: EagerTransformation[];
}

const getData = async (endpoint: string, body?: any, config?: RequestInit) => {
  const response = await fetch(`${process.env.API_URL!}/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // mode: "same-origin",
    // credentials: "include",
    body: body ? JSON.stringify({ ...body }) : null,
    ...config!,
  });

  const result: Response<any> = await response.json();

  if (!result.success) throw { ...result.errors };
  return result.data;
};

const api = {
  posts: {
    create: (formData: FormData) => {
      return getData("posts/create", null, {
        method: "POST",
        headers: {},
        body: formData,
      });
    },
    delete: ({ postId }: { postId: string }) => {
      return getData("posts", { postId }, { method: "DELETE" });
    },
    like: ({ postId }: { postId: string }) => {
      return getData("posts/like", { postId }, { method: "POST" });
    },
    getUserPosts: ({ userId }: { userId: string }) => {
      return getData(`posts/userPosts/${userId}`);
    },
    getPaths: () => getData("posts/getPaths"),
    getUserFeed: ({ after = "" }: { after?: string }) => {
      return getData(
        after ? `posts/userFeed?after=${after}` : "posts/userFeed"
      );
    },
    getPostById: ({ postId }: { postId: string }) => {
      return getData(`posts/${postId}`);
    },
  },
  users: {
    login: (credentials: { email: string; password: string }) => {
      return getData("users/login", { ...credentials }, { method: "POST" });
    },
    register: (credentials: {
      email: string;
      password: string;
      username: string;
      name: string;
    }) => {
      return getData("users/register", { ...credentials }, { method: "POST" });
    },
    update: (values: FormData) => {
      return getData(
        "users/updateUser",
        { ...values },

        { method: "PUT", headers: {}, body: values }
      );
    },
    updatePassword: ({
      ...values
    }: {
      userId: string;
      current_password: string;
      new_password: string;
      confirm_password: string;
    }) => {
      return getData("users/changePassword", { ...values }, { method: "POST" });
    },
    getSuggestedUsers: ({
      after,
      limit,
    }: {
      after?: string;
      limit?: number;
    }) => {
      return getData(
        after ? `users?after=${after}&limit=${limit}` : `users?limit=${limit}`
      );
    },
    getUserByUsername: ({ username }: { username: string }) => {
      return getData(`users/${username}`);
    },
    follow: ({ userId }: { userId: string }) => {
      return getData("users/follow", { userId }, { method: "POST" });
    },
    search: ({
      query,
      after,
      limit,
    }: {
      query?: string;
      after?: string;
      limit?: number;
    }) => {
      return getData(
        after
          ? `users/search?query=${query?.toLowerCase()}&after=${after}&limit=${limit}`
          : `users/search?query=${query?.toLowerCase()}&limit=${limit}`
      );
    },
    me: ({ userId }: { userId: string }) => {
      return getData(`users/me`, { userId });
    },
    providers: () => {
      return getData("users/providers");
    },
  },
  comments: {
    get: ({
      postId,
      after,
      limit,
      threadId,
    }: {
      postId: string;
      after?: string;
      limit: number;
      threadId?: string;
    }) => {
      return getData(
        after
          ? `comments?postId=${postId}&after=${after}&limit=${limit}&threadId=${threadId}`
          : `comments?postId=${postId}&limit=${limit}&threadId=${threadId}`
      );
    },
    create: ({
      ...values
    }: {
      inReplyToCommentId?: string;
      inReplyToUsername?: string;
      text: string;
      postId: string;
      prevDepth?: number;
    }) => {
      return getData("comments", { ...values }, { method: "POST" });
    },
    loadMore: ({
      postId,
      sliceAt,
      depth,
    }: {
      postId: string;
      sliceAt: number;
      depth: number;
    }) => {
      return getData(
        "comments/loadMore",
        { postId, sliceAt, depth },
        { method: "POST" }
      );
    },
    like: ({ commentId }: { commentId: string }) => {
      return getData("comments/like", { commentId }, { method: "POST" });
    },
    delete: ({ commentId }: { commentId: string }) => {
      return getData("comments", { commentId }, { method: "DELETE" });
    },
  },
};

export { getData, api };
