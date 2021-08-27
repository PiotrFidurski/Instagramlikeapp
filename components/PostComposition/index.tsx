import { PostType } from "@models/Post";
import { mQ } from "@styled";
import * as React from "react";
import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface Props {
  post: PostType;
  showSkeleton: boolean;
  isModal?: boolean;
}

interface PostComposition {
  Header: React.FC<any>;
  Content: React.FC<any>;
  Footer: React.FC<any>;
}

export const Post: React.FC<Props> & PostComposition = ({
  children,
  post,
  showSkeleton,
  isModal = false,
}) => (
  <div
    css={{
      marginBottom: isModal ? "0" : "10px",
      border: isModal ? 0 : "1px solid var(--border-color)",
      width: "100%",
      maxWidth: "600px",
      display: "flex",
      height: "100%",
      flexGrow: 1,
      flexDirection: "column",
      borderRadius: 3,
      background: "var(--container-background)",
      [mQ("mobile")]: {
        borderLeft: 0,
        borderRight: 0,
        borderRadius: 0,
        borderTop: 0,
        borderBottom: 0,
      },
    }}
  >
    {React.Children.map(children, (child: React.ReactNode) => {
      return React.cloneElement(child as React.ReactElement, {
        post,
        showSkeleton,
        isModal,
      });
    })}
  </div>
);

Post.Header = Header;
Post.Content = Content;
Post.Footer = Footer;
