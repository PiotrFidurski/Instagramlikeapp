import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import * as React from "react";

interface Props {
  path: string;
  onSessionChange?: () => void;
}

const hasOwnershipRoutes = [
  "/[username]/settings",
  "/[username]/settings/[route]",
] as Array<string>;

const useRedirectUnauthorized = ({ path, onSessionChange }: Props) => {
  const [owner, setOwner] = React.useState(false);

  const [session, loading] = useSession();

  const router = useRouter();

  React.useEffect(() => {
    if (session && hasOwnershipRoutes.includes(router.pathname)) {
      if (session.user.username !== router.query.username) {
        router.push("/");
      } else {
        setOwner(true);
      }
    }

    onSessionChange?.();

    if (!loading && !session) router.push(path);
  }, [session, loading, router]);

  return [loading, session, owner] as const;
};

export { useRedirectUnauthorized };
