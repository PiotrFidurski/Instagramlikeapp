import { mQ } from "@styled";

export const RightPanel: React.FC = ({ children }) => (
  <div
    css={{
      position: "sticky",
      top: "70px",
      maxWidth: "340px",
      minWidth: "0px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      [mQ("1000")]: { display: "none" },
    }}
  >
    {children}
  </div>
);
