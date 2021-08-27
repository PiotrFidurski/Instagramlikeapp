import { Alert } from "./AlertComposition";
import { AlertProps } from "./AlertComposition/context";

export const UpdateAlert: React.FC<AlertProps> = ({ ...props }) => {
  return (
    <Alert {...props}>
      <Alert.Dismiss />
      <Alert.Text>{props.value} has been updated.</Alert.Text>
    </Alert>
  );
};
