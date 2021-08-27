import { commentPipeline } from "@api/aggregation";
import Comment, { CommentDocument, CommentType } from "@models/Comment";
import { Types } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import dbConnect from "utils/dbConnect";
import { PaginatedResult, Response } from "utils/types";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<
    Response<
      | CommentDocument
      | CommentDocument[]
      | null
      | PaginatedResult<CommentType | null>
    >
  >
) => {
  await dbConnect();
  const session = await getSession({ req });

  const {
    postId,
    sliceAt = 5,
    depth,
  }: { sliceAt: number; depth: number; postId: string } = req.body;

  try {
    const targetReply = await Comment.aggregate([
      { $match: { _id: { $eq: Types.ObjectId(postId) } } },

      ...commentPipeline(session!, { sliceAt }),
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
    ]);

    const moreReplies = await Comment.aggregate([
      {
        $match: {
          inReplyToCommentId: { $eq: postId.toString() },
          _id: {
            $nin: [
              ...targetReply[0].replies.map((child: any) =>
                Types.ObjectId(child._id)
              ),
            ],
          },
        },
      },
      ...commentPipeline(session!, { adjustDepth: true, prevDepth: depth }),
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
    ]);

    return res
      .status(200)
      .json({ success: true, data: moreReplies, errors: {} });
  } catch (error) {
    throw new Error(error as string);
  }
};
