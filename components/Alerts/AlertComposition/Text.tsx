import { css } from "@emotion/react";
import { elipsisText } from "@styled";
import { AlertProps } from "./context";

const Text: React.FC<AlertProps> = ({ children }) => {
  return (
    <div
      css={{
        display: "flex",
        flexGrow: 1,
        minWidth: "0px",
        justifyContent: "center",
      }}
    >
      <span
        css={css`
          ${elipsisText};
          font-size: 14px;
          font-weight: 600;
        `}
      >
        {children}
      </span>
    </div>
  );
};

export { Text };
