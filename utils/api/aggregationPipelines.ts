import { Types } from "mongoose";
import { Session } from "next-auth";

interface CommentConfig {
  adjustDepth?: boolean;
  prevDepth?: number;
  sliceAt?: number;
}

const commentPipeline = (
  session: Session | null,
  { adjustDepth = false, prevDepth = 0, sliceAt }: CommentConfig = {}
) => [
  {
    $lookup: {
      from: "users",
      let: { owner: "$owner" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
        { $project: { password: 0 } },
      ],
      as: "owner",
    },
  },
  { $unwind: "$owner" },
  {
    $graphLookup: {
      from: "comments",
      startWith: "$children",
      connectFromField: "children",
      connectToField: "_id",
      maxDepth: 4,
      as: "replies",
      depthField: "depth",
    },
  },
  {
    $unwind: {
      path: "$replies",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $sort: {
      "replies.depth": -1,
      "replies._id": -1,
    },
  },
  {
    $lookup: {
      from: "users",
      let: { owner: "$replies.owner" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$_id", "$$owner"] },
          },
        },
        {
          $addFields: {
            followersCount: { $size: "$followers" },
            followingCount: { $size: "$following" },
          },
        },
        { $project: { password: 0, followers: 0, following: 0 } },
      ],
      as: "replies.owner",
    },
  },
  {
    $unwind: {
      path: "$replies.owner",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      replies: {
        $cond: {
          if: { $ne: ["$replies", {}] },
          then: {
            $mergeObjects: [
              "$replies",
              {
                owner: {
                  $mergeObjects: [
                    "$replies.owner",
                    {
                      username: {
                        $cond: {
                          if: { $eq: ["$replies.isTombstone", true] },
                          then: "[Deleted]",
                          else: "$replies.owner.username",
                        },
                      },
                      image: {
                        $cond: {
                          if: { $eq: ["$replies.isTombstone", true] },
                          then:
                            "https://res.cloudinary.com/chimson/image/upload/h_150,w_150,g_center/v1629360713/tombstone.png",
                          else: "$replies.owner.image",
                        },
                      },
                    },
                  ],
                },
                text: {
                  $cond: {
                    if: { $eq: ["$replies.isTombstone", true] },
                    then: "[Deleted]",
                    else: "$replies.text",
                  },
                },
                isLiked: session
                  ? {
                      $cond: {
                        if: {
                          $in: [
                            session ? Types.ObjectId(session?.user?._id) : "",
                            "$replies.likes",
                          ],
                        },
                        then: true,
                        else: false,
                      },
                    }
                  : null,
                hasChildren: {
                  $size: "$replies.children",
                },
                likesCount: {
                  $size: "$replies.likes",
                },
              },
            ],
          },
          else: {},
        },
      },
    },
  },
  {
    $project: {
      "replies.likes": 0,
    },
  },
  {
    $group: {
      _id: "$_id",
      likes: { $first: "$likes" },
      children: { $first: "$children" },
      isTombstone: { $first: "$isTombstone" },
      owner: { $first: "$owner" },
      postId: { $first: "$postId" },
      inReplyToCommentId: { $first: "$inReplyToCommentId" },
      inReplyToUsername: { $first: "$inReplyToUsername" },
      text: { $first: "$text" },
      createdAt: { $first: "$createdAt" },
      updatedAt: { $first: "$updatedAt" },
      replies: { $push: "$replies" },
    },
  },
  {
    $addFields: {
      replies: {
        $reduce: {
          input: "$replies",
          initialValue: {
            currentDepth: -1,
            currentReplies: [],
            previousReplies: [],
          },
          in: {
            $let: {
              vars: {
                prev: {
                  $cond: [
                    { $eq: ["$$value.currentDepth", "$$this.depth"] },
                    "$$value.previousReplies",
                    "$$value.currentReplies",
                  ],
                },
                current: {
                  $cond: [
                    { $eq: ["$$value.currentDepth", "$$this.depth"] },
                    "$$value.currentReplies",
                    [],
                  ],
                },
              },
              in: {
                currentDepth: "$$this.depth",
                previousReplies: "$$prev",
                currentReplies: {
                  $cond: {
                    if: { $ne: [sliceAt, undefined] },
                    then: {
                      $slice: [
                        {
                          $concatArrays: [
                            "$$current",
                            [
                              {
                                $mergeObjects: [
                                  "$$this",
                                  {
                                    children: [],
                                    depth: {
                                      $cond: {
                                        if: { $eq: [adjustDepth, true] },
                                        then: {
                                          $add: [
                                            "$$this.depth",
                                            prevDepth! + 2,
                                          ],
                                        },
                                        else: { $add: ["$$this.depth", 1] },
                                      },
                                    },
                                  },
                                  {
                                    replies: {
                                      $filter: {
                                        input: "$$prev",
                                        as: "e",
                                        cond: {
                                          $in: ["$$e._id", "$$this.children"],
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            ],
                          ],
                        },
                        Number(sliceAt!),
                      ],
                    },
                    else: {
                      $slice: [
                        {
                          $concatArrays: [
                            "$$current",
                            [
                              {
                                $mergeObjects: [
                                  "$$this",
                                  {
                                    children: [],
                                    depth: {
                                      $cond: {
                                        if: { $eq: [adjustDepth, true] },
                                        then: {
                                          $add: [
                                            "$$this.depth",
                                            prevDepth! + 2,
                                          ],
                                        },
                                        else: { $add: ["$$this.depth", 1] },
                                      },
                                    },
                                  },
                                  {
                                    replies: {
                                      $filter: {
                                        input: "$$prev",
                                        as: "e",
                                        cond: {
                                          $in: ["$$e._id", "$$this.children"],
                                        },
                                      },
                                    },
                                  },
                                ],
                              },
                            ],
                          ],
                        },
                        0,
                        5,
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      replies: {
        $cond: {
          if: { $ne: [sliceAt, undefined] },
          then: "$replies.currentReplies",
          else: { $slice: ["$replies.currentReplies", 0, 5] },
        },
      },
      owner: {
        $mergeObjects: [
          "$owner",
          {
            followersCount: { $size: "$owner.followers" },
            followingCount: { $size: "$owner.following" },
            username: {
              $cond: {
                if: { $eq: ["$isTombstone", true] },
                then: "[Deleted]",
                else: "$owner.username",
              },
            },
            image: {
              $cond: {
                if: { $eq: ["$isTombstone", true] },
                then:
                  "https://res.cloudinary.com/chimson/image/upload/h_150,w_150,g_center/v1629360713/tombstone.png",
                else: "$owner.image",
              },
            },
          },
        ],
      },
      text: {
        $cond: {
          if: { $eq: ["$isTombstone", true] },
          then: "[Deleted]",
          else: "$text",
        },
      },
      isLiked: session
        ? {
            $cond: {
              if: {
                $in: [
                  session ? Types.ObjectId(session?.user!._id) : "",
                  "$likes",
                ],
              },
              then: true,
              else: false,
            },
          }
        : null,
      hasChildren: { $size: "$children" },
      depth: {
        $cond: {
          if: { $eq: [adjustDepth, true] },
          then: { $add: [prevDepth!, 1] },
          else: 0,
        },
      },
      likesCount: { $size: "$likes" },
    },
  },
  {
    $project: {
      "replies.children": 0,
      "replies.likes": 0,
      likes: 0,
      children: 0,
      "owner.followers": 0,
      "owner.following": 0,
    },
  },
];

const userPipeline = (session: Session | null) => [
  {
    $lookup: {
      from: "users",
      localField: "following",
      foreignField: "_id",
      as: "following",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "followers",
      foreignField: "_id",
      as: "followers",
    },
  },

  {
    $addFields: {
      isFollowed: session
        ? {
            $cond: {
              if: {
                $in: [Types.ObjectId(session?.user?._id), "$followers._id"],
              },
              then: true,
              else: false,
            },
          }
        : null,
      followersCount: { $size: "$followers" },
      followingCount: { $size: "$following" },
    },
  },
  { $project: { password: 0, followers: 0, following: 0 } },
];

const postPipeline = (session: Session | null) => [
  {
    $lookup: {
      from: "users",
      let: { owner: "$owner" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$owner"] } } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
        {
          $addFields: {
            followersCount: { $size: "$followers" },
            followingCount: { $size: "$following" },
            isFollowed: session
              ? {
                  $cond: {
                    if: {
                      $in: [
                        Types.ObjectId(session?.user?._id),
                        "$followers._id",
                      ],
                    },
                    then: true,
                    else: false,
                  },
                }
              : null,
          },
        },
        { $project: { following: 0, followers: 0, password: 0 } },
      ],
      as: "owner",
    },
  },
  {
    $lookup: {
      from: "comments",
      localField: "comments",
      foreignField: "_id",
      as: "comments",
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "likes",
      foreignField: "_id",
      as: "likes",
    },
  },
  { $unwind: "$owner" },
  {
    $addFields: {
      likesCount: { $size: "$likes" },
      commentsCount: { $size: "$comments" },
      isLiked: session
        ? {
            $cond: {
              if: {
                $in: [
                  session ? Types.ObjectId(session?.user!._id) : "",
                  "$likes._id",
                ],
              },
              then: true,
              else: false,
            },
          }
        : null,
    },
  },
  { $project: { likes: 0, comments: 0 } },
];
export { postPipeline, userPipeline, commentPipeline };
