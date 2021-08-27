import { css, keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const breakPoints: { [key: string]: number } = {
  mobileSmall: 350,
  mobile: 500,
  mobileLarge: 600,
  "900": 900,
  "1000": 1000,
  "1040": 1040,
};

export const mQ = (
  n: "mobileSmall" | "mobile" | "mobileLarge" | "900" | "1000" | "1040"
) => {
  return `@media (max-width: ${breakPoints[n]}px)`;
};

export const animateWidth = keyframes`
  0% {  
    width:0%;
  }
  10% {
    width:10%;
  }
  50% {
    width:20%;
  }
  100% {
    width:50%;
  }
`;

export const finishAnimation = keyframes`
  0% {
    width:50%;
  }
  100% {
    width:100%;
  }
`;

export const animateBar = keyframes`
  from {  
    background-position: 0 0;
  }
  to {
    background-position: 500% 0;
  }
`;

const slideFromRight = keyframes`
 from {
    transform: translate3d(-430px, 0, 0);
  }
  to {
    transform: translate3d(0,0,0);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg)
  }
  to {
    transform: rotate(360deg)
  }
`;

const slideFromBottom = keyframes`
  from {
    transform: translate3d(0, 300px, 0);
  }
  to {
    transform: translate3d(0,0,0);
  }
`;

export const AvatarWrapper = styled.div(
  ({ width, height }: { width: string; height: string }) => ({
    width,
    height,
    minWidth: width,
    cursor: "pointer",
    borderRadius: 9999,
    position: "relative",
    "> div": {
      "> img": {
        borderRadius: 9999,
      },
    },
    "&:hover": {
      transition: "all 0.1s ease-in",
      background: "grey",
      borderColor: "#db1c5c",
      "> div": {
        "> img": {
          transition: "all 0.1s ease-in",
          filter: "brightness(0.8)",
        },
      },
    },
    "&:after": {
      content: '""',
      position: "absolute",
      borderRadius: "inherit",
      border: "1px solid var(--shadow-color)",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
);

export const Button = styled.button(
  ({ active, bgColor }: { active: boolean; bgColor?: string }) => {
    const hoverColor =
      bgColor &&
      [
        bgColor!.slice(0, bgColor.length - 1),
        ", 0.85",
        bgColor.slice(bgColor.length - 1),
      ]
        .join("")
        .replace("rgb", "rgba");

    return {
      background: bgColor ? bgColor : active ? "#e91e63" : "transparent",
      border: 0,
      borderRadius: 9999,
      padding: "5px 17px",
      color: active ? "rgb(255, 255, 255)" : "var(--primary-text-color)",
      display: "flex",
      alignItems: "center",
      flexGrow: 1,
      maxWidth: "100%",
      justifyContent: "center",
      textAlign: "center",
      fontSize: "inherit",
      cursor: "pointer",
      position: "relative",
      fontWeight: 600,
      transition: "background 0.1s ease-in",
      "&:after": {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        content: `""`,
        borderRadius: 9999,
        border: "1px solid var(--shadow-color)",
      },
      "&:hover": {
        background: hoverColor!
          ? hoverColor
          : active
          ? "#e60c56"
          : "var(--border-color)",
      },
      "&:disabled": {
        background: "rgb(233 30 99 / 50%)",
        cursor: "no-drop",
      },
    };
  }
);

export const menuItemsWrapper = css`
  position: absolute;
  top: 5px;
  box-shadow: 0 0 5px 1px var(--shadow-color);
  left: 0;
  display: flex;
  outline: none;
  width: 100%;
  min-height: auto;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 3px;
  min-width: 200px;
  background: var(--container-background);
  z-index: 9999;
`;

export const menuItemsPostVariant = css`
  top: -185px;
  left: -166px;
  ${mQ("mobileLarge")} {
    position: fixed;
    min-height: auto;
    top: auto;
    animation: ${slideFromBottom} 0.1s ease-in;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    height: auto;
  }
`;

export const menuItemsUserVariant = css`
  max-height: 100%;
  min-height: 224px;
  left: -195px;
  top: 30px;
  ${mQ("mobileLarge")} {
    position: fixed;
    animation: ${slideFromRight} 0.1s ease-in;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 70%;
    height: 100vh;
  }
`;

export const menuCaret = css`
  position: absolute;
  left: 50%;
  width: 15px;
  height: 15px;
  z-index: -1;
  background: var(--container-background);
  top: -7px;
  box-shadow: 0 0 5px 1px var(--shadow-color);
  transform: rotate(45deg);
  ${mQ("mobileLarge")} {
    display: none;
  }
`;

export const menuCaretUserVariant = css`
  left: 175px;
`;

export const menuCaretPostVariant = css`
  left: 175px;
  top: initial;
  bottom: -7px;
`;

export const StyledMenuItem = styled.div(
  ({ active, danger }: { active: boolean; danger?: boolean }) => ({
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    color: danger ? "#ef5350" : "var(--primary-text-color)",
    background: active
      ? "var(--container-hover-background)"
      : "var(--container-background)",
    padding: "8px 16px",
    cursor: "pointer",
  })
);

export const elipsisText = css({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const navContainerMobile = css`
  border-top: 1px solid var(--border-color);
  border-bottom: 0;
  bottom: 0;
  display: none;
  height: 50px;
  top: auto;
  ${mQ("mobile")} {
    display: flex;
  }
`;

export const navContainer = css`
  width: 100%;
  background-color: var(--container-background);
  height: auto;
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  height: 50px;
  top: 0px;
  left: 0;
  right: 0;
  z-index: 9999;
  color: var(--secondary-text-color);
`;

export const navWrapper = css`
  max-width: 1100px;
  display: flex;
  margin: 0 auto;
  height: 100%;
  align-items: center;
  ${mQ("900")} {
    max-width: 900px;
  }
  ${mQ("mobileLarge")} {
    flex-grow: 1;
  }
`;

export const navItem = css`
  display: flex;
  position: relative;
  align-items: center;
  flex-grow: 1;
  min-width: 0px;
  height: 100%;
  justify-content: center;
`;

export const navItemCenter = css`
  justify-content: center;
  ${mQ("mobile")} {
    display: none;
  }
`;

export const navItemStart = css`
  justify-content: flex-start;
  ${mQ("mobile")} {
    justify-content: center;
    margin-right: 50px;
  }
`;

export const navItemEnd = css`
  justify-content: flex-end;
  align-items: center;
  ${mQ("mobile")} {
    justify-content: flex-start;
    flex-grow: 0;
    cursor: pointer;
    flex-basis: 50px;
    justify-content: center;
  }
`;

export const Spinner = styled.div({
  width: "24px",
  height: "24px",
  marginRight: "5px",
  borderRadius: "9999px",
  border: "2px solid var(--border-color)",
  borderLeft: "3px solid var(--primary-text-color)",
  background: "transparent",
  animation: `${spin}  0.8s infinite linear`,
});

// width: "24px",
//   height: "24px",
//   marginRight: "5px",
//   border-radius: "9999px",
//   border: "2px solid var(--border-color)",
//   border-left: "3px solid var(--primary-text-color)",
//   background: "transparent",
