import * as yup from "yup";

const createSchema = yup.object().shape({
  text: yup
    .string()
    .min(1)
    .max(255)
    .required(),
});

export { createSchema };
