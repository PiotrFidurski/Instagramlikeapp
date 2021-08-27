import { animateBar, animateWidth, finishAnimation } from "@styled";
import * as React from "react";

interface Props {
  isLoading: boolean;
  status: "idle" | "loading" | "success" | "error";
}

export const LoadingBar: React.FC<Props> = ({ isLoading, status }) => {
  return (
    <div
      css={{
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--loading-background-color)",
        zIndex: 10000,
        display: status === "idle" || status === "error" ? "none" : "block",
      }}
    >
      <div
        css={{
          width: "0%",
          animation:
            !isLoading && status === "success"
              ? `${finishAnimation} 0.4s`
              : isLoading && status === "loading"
              ? `${animateWidth} 0.5s`
              : "",
          animationIterationCount: 1,
          animationFillMode: isLoading ? "forwards" : "none",
        }}
      >
        <div
          css={{
            position: "fixed",
            background: "red",
            height: "30px",
          }}
        ></div>
        <div
          css={{
            position: "fixed",
            height: "3px",
            top: 0,
            width: "inherit",
            left: 0,
            zIndex: 9999,
            background:
              "#27c4f5 linear-gradient(to right, #27c4f5, #a307ba,#fd8d32,#58c322,#27c4f5)",
            backgroundSize: "500%",
            transformOrigin: "left",
            animation: `${animateBar} 10s linear infinite`,
          }}
        ></div>
      </div>
    </div>
  );
};
