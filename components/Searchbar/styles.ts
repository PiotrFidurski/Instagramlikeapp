import { css } from "@emotion/react";

export const CenterItems = css({
  color: "var(--secondary-text-color)",
  display: "flex",
  justifyContent: "center",
  flexGrow: 1,
  alignItems: "center",
  "> span": {
    fontWeight: 600,
    fontSize: 12,
    padding: "10px",
  },
});
