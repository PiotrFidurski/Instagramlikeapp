import * as React from "react";
import { useAlert } from "./context";
import { Dismiss } from "./Dismiss";
import { Text } from "./Text";
import { Undo } from "./Undo";

interface Props {}

interface AlertComposition {
  Dismiss: React.FC<any>;
  Text: React.FC<any>;
  Undo: React.FC<any>;
}

const Alert: React.FC<Props> & AlertComposition = ({ children, ...props }) => {
  const { alerts, createAlert, dismiss } = useAlert();

  const childrenWithProps = React.Children.map(children, (child) => {
    return React.cloneElement(child as React.ReactElement, {
      alerts,
      createAlert,
      open,
      dismiss,
      ...props,
    });
  });

  return (
    <div
      css={{
        color: "white",
        borderRadius: "8px",
        display: "flex",
        border: "1px solid transparent",
        alignItems: "center",
        position: "relative",
        background: "#0d47a1",
        backgroundClip: "padding-box",
        padding: "1px",
        height: "50px",
        marginBottom: "10px",
        width: "100%",
        ":after": {
          position: "absolute",
          top: "-1px",
          right: "-1px",
          bottom: "-1px",
          left: "-1px",
          borderRadius: "8px",
          content: '""',
          background: "var(--border-color)",
          zIndex: -1,
        },
      }}
    >
      {childrenWithProps}
    </div>
  );
};

Alert.Dismiss = Dismiss;
Alert.Text = Text;
Alert.Undo = Undo;

export { Alert };
