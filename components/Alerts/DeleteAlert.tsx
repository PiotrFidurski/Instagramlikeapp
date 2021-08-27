import { Alert } from "./AlertComposition";
import { AlertProps } from "./AlertComposition/context";

export const DeleteAlert: React.FC<AlertProps> = ({ ...props }) => {
  return (
    <Alert {...props}>
      <Alert.Dismiss />
      <Alert.Text>Your {props.value} has been removed.</Alert.Text>
    </Alert>
  );
};
