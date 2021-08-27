import * as React from "react";
import { useRedirectUnauthorized } from "utils/hooks/useRedirectUnauthorized";
import Route from "./[route]";

interface Props {}

const SettingsPage: React.FC<Props> = () => {
  const [_, session, owner] = useRedirectUnauthorized({
    path: "/login",
  });

  if (!session || !owner) return <></>;

  return <Route />;
};

export default SettingsPage;
