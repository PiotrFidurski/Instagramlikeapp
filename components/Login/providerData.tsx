import { Discord, Github, Google, Twitter } from "@assets/svgs/index";
import { ClientSafeProvider } from "next-auth/client";

export type Providers = Record<
  "Discord" | "GitHub" | "Google" | "Twitter",
  ClientSafeProvider
>;

const data: Record<
  string,
  () => { render: React.ReactElement; color: string }
> = {
  GitHub: () => ({
    render: (
      <Github
        width="24px"
        height="24px"
        fill="white"
        css={{ marginRight: "5px" }}
      />
    ),
    color: "rgb(13,17,23)",
  }),
  Discord: () => ({
    render: (
      <Discord
        width="24px"
        height="24px"
        fill="white"
        css={{ marginRight: "5px" }}
      />
    ),
    color: "rgb(88,100,240)",
  }),
  Google: () => ({
    render: (
      <Google
        width="24px"
        height="24px"
        fill="white"
        css={{ marginRight: "5px" }}
      />
    ),
    color: "rgb(231, 46, 46)",
  }),
  Twitter: () => ({
    render: (
      <Twitter
        width="24px"
        height="24px"
        fill="white"
        css={{ marginRight: "5px" }}
      />
    ),
    color: "rgb(29, 161, 242)",
  }),
};

export { data };
