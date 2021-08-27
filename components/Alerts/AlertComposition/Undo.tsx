import { css } from "@emotion/react";
import { Button, elipsisText } from "@styled";
import { AlertProps, useAlert } from "./context";

const Undo: React.FC<AlertProps> = ({ ...props }) => {
  const { createAlert } = useAlert();

  const { onUndo = () => {} } = props;

  return (
    <div css={{ padding: "0 10px 0 0", zIndex: 2 }}>
      <Button
        active={false}
        onClick={() => {
          onUndo();

          createAlert("action", {
            timeout: 7000,
            isActive: !props.isActive,
            onUndo: () => onUndo(),
            value: props.value,
          });
        }}
      >
        <span
          css={css`
            ${elipsisText};
            font-size: 12px;
          `}
        >
          Undo
        </span>
      </Button>
    </div>
  );
};

export { Undo };
