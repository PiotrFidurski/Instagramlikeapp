import styled from "@emotion/styled";
import { PostType } from "@models/Post";
import * as React from "react";
import { Details } from "./Details";
import { ImageComponent } from "./Image";

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  flex-grow: 1;
  transition: opacity 350ms ease;
`;

interface Props {
  post: PostType;
  showSkeleton: boolean;
  isModal: boolean;
}

interface ContentComposition {
  Image: React.FC<any>;
  Details: React.FC<any>;
}

const Content: React.FC<Props> & ContentComposition = ({
  post,
  children,
  showSkeleton,
  isModal,
}) => (
  <CardContainer>
    {React.Children.map(children, (child) => {
      return React.cloneElement(child as React.ReactElement, {
        post,
        showSkeleton,
        isModal,
      });
    })}
  </CardContainer>
);

Content.Image = ImageComponent;
Content.Details = Details;

export { Content };
