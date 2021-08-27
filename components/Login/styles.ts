import styled from "@emotion/styled";

export const Label = styled.label(({ marginB }: { marginB: string }) => ({
  height: "37px",
  position: "relative",
  flexDirection: "column",
  marginBottom: marginB,
  display: "flex",
  flexGrow: 1,
}));

export const Placeholder = styled.span(
  ({ value, danger }: { value: string; danger?: boolean }) => ({
    transform: value.length ? "scale(.82222) translateY(-10px)" : "",
    transition: "all .1s ease-out",
    whiteSpace: "nowrap",
    height: "inherit",
    lineHeight: "37px",
    right: 0,
    marginLeft: "1px",
    fontSize: "12px",
    transformOrigin: "left",
    pointerEvents: "none",
    overflow: "hidden",
    userSelect: "none",
    textOverflow: "ellipsis",
    color: danger ? "#ef5350" : "#607d8b",
    position: "absolute",
    left: "8px",
    "> span": {
      textTransform: "capitalize",
    },
  })
);

export const Input = styled.input(({ value }: { value: string }) => ({
  flexGrow: 1,
  border: "1px solid #dbdbdb",
  borderRadius: "3px",
  padding: value.length ? "14px 0 2px 8px!important" : "9px 0 7px 8px",
}));

export const SeparatorContainer = styled.div({
  display: "flex",
  flexGrow: 1,
  marginBottom: "5px",
  flexDirection: "row",
  alignItems: "center",
});

export const Separator = styled.div({
  flexGrow: 1,
  borderBottom: "1px solid #dbdbdb",
  display: "flex",
});
