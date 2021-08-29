import { useAuth } from "@components/AuthContext/useAuth";
import { mQ } from "@styled";
import { useRouter } from "next/router";
import { data } from "./data";

export const Mobile: React.FC = () => {
  const { user } = useAuth();

  const { pathname, back, query, push } = useRouter();

  return (
    <div
      css={{
        display: "none",
        alignItems: "center",
        height: "100%",
        [mQ("mobile")]: {
          display: "flex",
          flexGrow: 1,
          flexDirection: "row-reverse",
        },
      }}
    >
      {data[pathname]?.render({
        onClick: () => back(),
        goTo: (path: string) => push(path),
        user,
        query,
      })}
    </div>
  );
};
