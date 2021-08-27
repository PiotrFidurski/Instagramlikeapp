import { Alert } from "./AlertComposition";
import { AlertProps } from "./AlertComposition/context";

export const ActionWithUndoAlert: React.FC<AlertProps> = ({ ...props }) => {
  const { isActive = false, value = "" } = props;
  return (
    <Alert {...props}>
      <Alert.Dismiss />
      <Alert.Text>
        {isActive ? `Unfollowed ${value}` : `Followed ${value}`}
      </Alert.Text>
      <Alert.Undo />
    </Alert>
  );
};
