import styled from "@emotion/styled";
import { Skeleton } from "@material-ui/lab";
import { PostType } from "@models/Post";
import Image from "next/image";
import * as React from "react";
import { usePalette } from "react-palette";

const ImageContainer = styled.div`
  ${({
    imgWidth,
    imgHeight,
    paletteColor,
    isModal,
  }: {
    isModal?: boolean;
    imgWidth?: number;
    imgHeight?: number;
    paletteColor?: string;
  }) => `
  position: relative;
  display: block;
  height: 100%;
  background: ${paletteColor ? paletteColor : "transparent"};
  > div {
    padding-bottom: ${
      imgWidth && imgHeight && !isModal
        ? `calc(${imgHeight} / ${imgWidth} * 100% + 1px)`
        : "100%"
    };
    position: unset !important;
  }
`}
`;

interface Props {
  post: PostType;
  showSkeleton: boolean;
  isModal?: boolean;
}

export const ImageComponent: React.FC<Props> = ({
  post,
  showSkeleton,
  isModal,
}) => {
  const { data, loading } = usePalette(post?.image?.original?.url!);

  return (
    <>
      {showSkeleton || loading ? (
        <Skeleton variant="rect" width="100%" animation="wave">
          <ImageContainer>
            <Image
              alt="placeholder"
              src="/worry.png"
              layout="fill"
              objectFit="cover"
              quality={1}
            />
          </ImageContainer>
        </Skeleton>
      ) : (
        <ImageContainer
          isModal={isModal}
          paletteColor={data.darkVibrant}
          imgWidth={post?.image?.original?.width!}
          imgHeight={post?.image?.original?.height!}
        >
          <Image
            src={post?.image?.original?.url}
            layout="fill"
            objectFit="cover"
            quality={100}
            loading="eager"
            alt="postImage"
          />
        </ImageContainer>
      )}
    </>
  );
};
