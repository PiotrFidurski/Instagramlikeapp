import { Skeleton } from "@material-ui/lab";
import { PostType } from "@models/Post";
import { AvatarWrapper } from "@styled";
import Image from "next/image";
import Link from "next/link";

interface Props {
  post: PostType;
  showSkeleton: boolean;
}

const Header: React.FC<Props> = ({ post, showSkeleton }) => (
  <div
    css={{
      display: "flex",
      flexGrow: 1,
      justifyContent: "center",
      padding: "8px",
    }}
  >
    <Link href={`/${post.owner.username}`}>
      <a>
        {showSkeleton ? (
          <div css={{ height: "37px" }}>
            <Skeleton variant="circle" width={37} />
          </div>
        ) : (
          <AvatarWrapper width="37px" height="37px">
            <Image
              src={post.owner.image}
              objectFit="contain"
              layout="fill"
              alt="userAvatar"
              css={{ borderRadius: 9999 }}
            />
          </AvatarWrapper>
        )}
      </a>
    </Link>
  </div>
);

export { Header };
