import * as React from "react";
import { createPortal } from "react-dom";
import { ActionWithUndoAlert } from "../ActionWithUndoAlert";
import { DeleteAlert } from "../DeleteAlert";
import { UpdateAlert } from "../UpdateAlert";
import { AlertProps, useAlert } from "./context";

const alerts_ = {
  action: ActionWithUndoAlert,
  update: UpdateAlert,
  delete: DeleteAlert,
} as Record<string, React.FC<AlertProps>>;

interface AlertRootProps {
  selector: string;
}

const AlertRoot: React.FC<AlertRootProps> = ({ selector }) => {
  const [mounted, setMounted] = React.useState(false);

  const { alerts } = useAlert();

  React.useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted && alerts
    ? createPortal(
        alerts &&
          alerts.map((alert: any) => {
            const props: AlertProps = { ...alert, ...alert.props };
            const Element = alerts_[alert.key];
            return <Element {...props} key={alert.id} />;
          }),
        document.querySelector(selector)!
      )
    : null;
};

export { AlertRoot };
