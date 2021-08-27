import { CommentType } from "@models/Comment";
import * as React from "react";
import { Post } from "./PostComposition";
import { Content } from "./PostComposition/Content";

const stubPost = {
  _id: "1",
  description: "stub",
  image: {} as any,
  likes: [] as any,
  owner: {} as any,
  commentsCount: 0,
  likesCount: 0,
  isLiked: false,
  comments: [] as Array<CommentType>,
  createdAt: "" as any,
};

interface Props {
  isLoading: boolean;
}

export const PostLoader: React.FC<Props> = ({ isLoading }) => (
  <Post
    post={stubPost}
    key={stubPost._id}
    showSkeleton={isLoading}
    isModal={false}
  >
    <Post.Header />
    <Post.Content>
      <Content.Image></Content.Image>
      <Content.Details></Content.Details>
    </Post.Content>
    <Post.Footer />
  </Post>
);
