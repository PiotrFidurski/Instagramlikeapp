import { Cancel, Rotate } from "@assets/svgs/index";
import * as React from "react";
import { Button } from "./styles";

interface Props {
  preview: string;
  degrees: number;
}

export const Preview: React.FC<Props> = ({ preview, degrees, children }) => (
  <>
    <div
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        bottom: 0,
        right: 0,
      }}
    >
      <img
        src={preview}
        css={{
          userSelect: "none",
          transitionDuration: "0.2s",
          transitionProperty: "transform",
          transform: `rotate(${degrees}deg)`,
          width: "100%",
          overflow: "hidden",
          height: "100%",
          minHeight: "0%",
          minWidth: "0%",
          objectFit: "contain",
          display: preview ? "block" : "none",
        }}
      />
      {!preview ? (
        <div
          css={{
            display: "flex",
            position: "absolute",
            top: 0,
            width: "100%",
            alignItems: "center",
            flexGrow: 1,
            zIndex: -1,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <h2>Choose an image</h2>
        </div>
      ) : null}
    </div>
    {preview ? children : null}
  </>
);

interface PreviewButtonsProps {
  clearPreview: () => void;
  clearInput: () => void;
  rotate: () => void;
}

export const PreviewButtons: React.FC<PreviewButtonsProps> = ({
  clearPreview,
  clearInput,
  rotate,
}) => (
  <div
    css={{
      display: "flex",
      alignItems: "center",
      flexGrow: 1,
      justifyContent: "flex-end",
    }}
  >
    <Button
      type="button"
      onClick={() => {
        clearPreview();
        clearInput();
      }}
      top={10}
    >
      <Cancel fill="var(--primary-text-color)" width="35px" height="35px" />
    </Button>
    <Button type="button" onClick={rotate}>
      <Rotate fill="var(--primary-text-color)" width="35px" height="35px" />
    </Button>
  </div>
);
