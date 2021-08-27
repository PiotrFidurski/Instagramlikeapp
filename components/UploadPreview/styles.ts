import styled from "@emotion/styled";

export const Button = styled.button((props: { top?: number }) => ({
  padding: "5px",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  height: "45px",
  top: props.top ? props.top : undefined,
  bottom: props.top ? 0 : 10,
  boxShadow: "0px 0px 3px 2px var(--shadow-color)",
  right: 10,
  borderRadius: 9999,
  border: "1px solid var(--border-color)",
  background: "var(--container-background)",
  "&:hover": { cursor: "pointer" },
}));
