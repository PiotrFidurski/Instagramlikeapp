import { useAuth } from "@components/AuthContext/useAuth";
import { Feed } from "@components/Feed";
import { Footer } from "@components/Footer";
import { useModal } from "@components/Modals/ModalComposition/context";
import { RightPanel } from "@components/RightPanel";
import { SuggestedUsers } from "@components/SuggestedUsers";
import { mQ } from "@styled";
import { Session } from "next-auth";
import * as React from "react";
import { useRedirectUnauthorized } from "utils/hooks/useRedirectUnauthorized";

interface Props {
  session: Session;
}

const HomePage: React.FC<Props> = () => {
  const { setModal } = useModal();

  const { user, loading } = useAuth();

  const [_, session] = useRedirectUnauthorized({
    path: "/login",
  });

  React.useEffect(() => {
    if (user?.changedNameOnSignIn) {
      setModal((modal) => ({ ...modal, key: "UPDATE_USER", open: true }));
    }
  }, [user, loading]);

  if (!session) return null;

  return (
    <div
      css={{
        display: "flex",
        flexGrow: 1,
        justifyContent: "space-between",
        position: "relative",
        alignItems: "flex-start",
        [mQ("1000")]: { flexDirection: "column", alignItems: "center" },
      }}
    >
      <Feed />
      <RightPanel>
        <SuggestedUsers />
        <Footer />
      </RightPanel>
    </div>
  );
};

export default HomePage;
