import { navContainer, navWrapper } from "@styled";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

export const TopNavbar: React.FC = () => (
  <div css={navContainer}>
    <div css={navWrapper}>
      <Desktop />
      <Mobile />
    </div>
  </div>
);
