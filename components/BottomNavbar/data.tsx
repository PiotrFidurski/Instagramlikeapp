import {
  Heart,
  HeartFilled,
  Home,
  HomeFilled,
  Loupe,
  Plus,
} from "@assets/svgs/index";
import { UserType } from "@models/User";
import { AvatarWrapper } from "@styled";
import Image from "next/image";

interface Paths {
  href: string;
  render: (
    user: UserType
  ) => { regular: React.ReactElement; filledVariant: React.ReactElement };
}

export const paths: Array<Paths> = [
  {
    href: "/",
    render: () => ({
      regular: (
        <Home
          width="24px"
          height="100%"
          fill="var(--primary-text-color)"
          stroke="var(--primary-text-color)"
          strokeWidth="10px"
        />
      ),
      filledVariant: (
        <HomeFilled
          width="24px"
          height="100%"
          fill="var(--primary-text-color)"
        />
      ),
    }),
  },
  {
    href: "/search",
    render: () => ({
      regular: (
        <Loupe width="24px" height="100%" fill="var(--primary-text-color)" />
      ),
      filledVariant: (
        <Loupe
          width="24px"
          height="100%"
          fill="var(--primary-text-color)"
          stroke="var(--primary-text-color)"
          strokeWidth="8px"
        />
      ),
    }),
  },
  {
    href: "/create",
    render: () => ({
      regular: (
        <Plus width="24px" height="100%" fill="var(--primary-text-color)" />
      ),
      filledVariant: (
        <Plus
          width="24px"
          height="100%"
          fill="var(--primary-text-color)"
          strokeWidth="13px"
          stroke="var(--primary-text-color)"
        />
      ),
    }),
  },
  {
    href: "/activity",
    render: () => ({
      regular: (
        <Heart width="24px" height="100%" fill="var(--primary-text-color)" />
      ),
      filledVariant: (
        <HeartFilled
          width="24px"
          height="100%"
          fill="var(--primary-text-color)"
        />
      ),
    }),
  },
  {
    href: "/[username]",
    render: ({ image }) => ({
      regular: (
        <AvatarWrapper width="24px" height="24px">
          <Image
            width="24"
            height="24"
            layout="intrinsic"
            alt="userAvatar"
            src={image}
          />
        </AvatarWrapper>
      ),
      filledVariant: (
        <AvatarWrapper width="24px" height="24px">
          <div
            css={{
              position: "absolute",
              width: "30px",
              height: "30px",
              top: "-3px",
              left: "-3px",
              borderRadius: 9999,
              right: 0,
              bottom: 0,
              border: "1px solid var(--primary-text-color)",
            }}
          />
          <Image width="24" height="24" layout="intrinsic" src={image} />
        </AvatarWrapper>
      ),
    }),
  },
];
