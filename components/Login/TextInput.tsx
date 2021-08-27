import { FormikProps } from "formik";
import * as React from "react";
import { Input, Label, Placeholder } from "./styles";

interface Props extends FormikProps<any> {
  type:
    | "email"
    | "name"
    | "username"
    | "password"
    | "bio"
    | "confirm_password"
    | "new_password"
    | "current_password";
}

export const TextInput: React.FC<Props> = ({ ...props }) => {
  const {
    type,
    values,
    touched,
    errors,
    handleChange,
    setFieldTouched,
  } = props;

  return (
    <Label htmlFor={type} marginB="7px">
      <Placeholder
        value={values[type]}
        danger={touched[type] ? !!errors?.[type]?.length : false}
      >
        <span>
          {touched[type] && errors[type]
            ? errors[type]
            : type.replace("_", " ")}
        </span>
      </Placeholder>
      <Input
        type={
          type === "password" ||
          type === "current_password" ||
          type === "new_password" ||
          type === "confirm_password"
            ? "password"
            : "text"
        }
        name={type}
        value={values[type]}
        onChange={(e: React.BaseSyntheticEvent) => {
          handleChange(e);
          setFieldTouched(type, true, false);
        }}
        autoComplete="new-password"
      />
    </Label>
  );
};
