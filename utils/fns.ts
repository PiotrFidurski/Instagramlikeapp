import { CommentType } from "@models/Comment";
import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { NextApiResponse } from "next-auth/internals/utils";
import * as yup from "yup";

const setFormData = (values: Record<string, any>) => {
  const formData = new FormData();
  Object.entries(values).forEach((entry: any) => {
    const [key, value] = entry;
    formData.set(key, value);
  });
  return formData;
};

function formatYupErrors(errors: yup.ValidationError) {
  let formatted: Record<string, string> = {};

  errors.inner.forEach((e) => {
    if (!Object.keys(formatted).includes(e.path!)) {
      formatted = { ...formatted, [e.path!]: e.errors[0] };
    }
  });

  return formatted;
}

const authorize = async (
  req: NextApiRequest,
  res: NextApiResponse,
  type?: string
) => {
  const session = await getSession({ req });
  if (session) {
    return session;
  } else {
    return type === "paginatedResult"
      ? res.status(400).json({
          success: false,
          data: {
            pages: [],
            pageInfo: {
              hasNextPage: false,
              startCursor: "",
              endCursor: "",
            },
          },
          errors: { error: "Not authorized to perform this action." },
        })
      : res.status(401).json({
          success: false,
          data: null,
          status: 401,
          errors: [{ message: "Not authorized to perform this action." }],
        });
  }
};

const addNested = (comment: CommentType, data: CommentType) => {
  comment.replies?.map((child) => {
    if (child._id === data.inReplyToCommentId) {
      child.replies?.unshift(data);
      child.hasChildren = child.hasChildren + 1;
    }
    addNested(child, data);
  });
};

const likeNested = (c: CommentType, comment: CommentType) => {
  c.replies?.map((child) => {
    if (child._id === comment!._id) {
      child.isLiked = !child.isLiked;
      child.likesCount = child.isLiked
        ? child.likesCount + 1
        : child.likesCount - 1;
    }
    likeNested(child, comment);
  });
};

const deleteNested = (
  c: CommentType,
  comment: CommentType,
  data: CommentType
) => {
  if (!c.replies) return c;
  c.replies.map((child) => {
    if (child.hasChildren > 0 && child._id === comment._id) {
      child.owner.username = "User has deleted this comment.";
      child.owner.image = data.owner.image;
      child.text = "";
      child.isTombstone = data.isTombstone;
    }

    if (child.hasChildren === 0 && child._id === comment._id) {
      c.hasChildren = c.hasChildren - 1;
    }

    deleteNested(child, comment, data);
  });
};

export {
  formatYupErrors,
  authorize,
  setFormData,
  addNested,
  likeNested,
  deleteNested,
};
