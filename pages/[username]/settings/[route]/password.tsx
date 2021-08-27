import { api } from "@api/index";
import { useAlert } from "@components/Alerts/AlertComposition/context";
import { LoadingBar } from "@components/LoadingBar";
import { TextInput } from "@components/Login/TextInput";
import { css } from "@emotion/react";
import { UserType } from "@models/User";
import { Button, elipsisText } from "@styled";
import { Formik, FormikErrors, FormikHelpers } from "formik";
import { useMutation } from "react-query";
import {
  Container,
  formStyle,
  speparatorStyle,
} from "../../../../utils/UserSettingsPage/styles";

interface Props {
  user: UserType;
}

interface Values {
  confirm_password: string;
  new_password: string;
  current_password: string;
}

const PasswordPage: React.FC<Props> = ({ user }) => {
  const { createAlert } = useAlert();

  const { mutate, isLoading, status, reset } = useMutation(
    "changePassword",
    (values: Values) =>
      api.users.updatePassword({ ...values, userId: user?._id! })
  );

  const handleSubmit = ({ ...props }: FormikHelpers<Values> & Values) => {
    const {
      confirm_password,
      new_password,
      current_password,
      setErrors,
      resetForm,
    } = props;
    mutate(
      { current_password, new_password, confirm_password },
      {
        onSuccess: () => {
          createAlert("update", {
            timeout: 5000,
            value: "Password",
          });
          setTimeout(() => {
            resetForm();
            reset();
          }, 300);
        },
        onError: (error) => setErrors(error as FormikErrors<Values>),
      }
    );
  };

  return (
    <Container>
      <LoadingBar isLoading={isLoading} status={status} />
      <span
        css={css`
          font-weight: 600;
          font-size: 15;
          color: var(--secondary-text-color);
          ${elipsisText};
        `}
      >
        Change Password
      </span>
      <div css={speparatorStyle} />
      <Formik<Values>
        onSubmit={(values, helpers) => handleSubmit({ ...values, ...helpers })}
        initialValues={{
          current_password: "",
          new_password: "",
          confirm_password: "",
        }}
      >
        {({ ...props }) => (
          <form css={formStyle} onSubmit={props.handleSubmit}>
            <div css={{ flexGrow: 1, width: "100%" }}>
              <TextInput type="current_password" {...props} />
              <TextInput type="new_password" {...props} />
              <TextInput type="confirm_password" {...props} />
              <Button active={false}>
                <span>Submit</span>
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default PasswordPage;
