import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { mQ } from "@styled";

export const Container = styled.div({
  display: "flex",
  flexGrow: 1,
  background: "var(--container-background)",
  borderTop: "1px solid var(--border-color)",
  borderRight: "1px solid var(--border-color)",
  borderBottom: "1px solid var(--border-color)",
  color: "var(--primary-text-color)",
  height: "100vh",
  padding: "10px",
  flexDirection: "column",
  [mQ("mobile")]: {
    borderTop: 0,
  },
});

export const formStyle = css({
  width: "100%",
  maxWidth: "470px",
  flexDirection: "column",
  margin: "0 auto",
  display: "flex",
  justifyContent: "flex-start",
  [mQ("mobile")]: { alignItems: "flex-start" },
});

export const speparatorStyle = css({
  display: "flex",
  borderBottom: "1px solid var(--border-color)",
  height: "5px",
  marginBottom: "10px",
});
