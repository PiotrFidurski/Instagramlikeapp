import Skeleton from "@material-ui/lab/Skeleton";
import { AvatarWrapper } from "@styled";
import Image from "next/image";

export interface AvatarProps {
  loading?: boolean;
  image?: string;
  smaller?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ loading, image, smaller }) => {
  return loading ? (
    <div css={{ height: smaller ? "38px" : "48px" }}>
      <Skeleton variant="circle" width={smaller ? 38 : 48} />
    </div>
  ) : (
    <AvatarWrapper
      width={smaller ? "38px" : "48px"}
      height={smaller ? "38px" : "48px"}
    >
      <Image src={image!} objectFit="contain" layout="fill" alt="avatar" />
    </AvatarWrapper>
  );
};
