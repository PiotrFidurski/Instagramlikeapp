import { UserType } from "@models/User";
import { navContainer, navWrapper } from "@styled";
import { Desktop } from "./Desktop";
import { Mobile } from "./Mobile";

interface Props {
  user: UserType;
}

export const TopNavbar: React.FC<Props> = ({ user }) => (
  <div css={navContainer}>
    <div css={navWrapper}>
      <Desktop user={user} />
      <Mobile user={user} />
    </div>
  </div>
);
