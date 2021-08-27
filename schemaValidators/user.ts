import * as yup from "yup";

const FILE_SIZE = 10 * 1024 * 1024;

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(8)
    .max(40)
    .required()
    .matches(/^(?=.*[A-Z])/, "must contain at least one capital letter")
    .matches(/^(?=.*[0-9])/, "must contain at least one number")
    .matches(
      /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "must contain at least one special character"
    )
    .matches(/^(?=.*\d)(?=.*[a-z]).{8,}$/),
});

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .min(2)
    .required(),
  name: yup
    .string()
    .min(2)
    .required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(8)
    .max(40)
    .required()
    .matches(/^(?=.*[A-Z])/, "must contain at least one capital letter")
    .matches(/^(?=.*[0-9])/, "must contain at least one number")
    .matches(
      /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "must contain at least one special character"
    )
    .matches(/^(?=.*\d)(?=.*[a-z]).{8,}$/),
});

const updateSchema = yup.object().shape({
  username: yup
    .string()
    .min(2)
    .required(),
  name: yup
    .string()
    .min(2)
    .required(),
  bio: yup.string(),
  file: yup
    .mixed()
    .test(
      "fileSize",
      "File too large, accepting maximum of 10mb.",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format, accepted formats are image/png, jpeg, jpg, webp",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

const updatePasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .min(8)
    .max(40)
    .required()
    .matches(/^(?=.*[A-Z])/, "must contain at least one capital letter")
    .matches(/^(?=.*[0-9])/, "must contain at least one number")
    .matches(
      /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      "must contain at least one special character"
    )
    .matches(/^(?=.*\d)(?=.*[a-z]).{8,}$/),
  confirm_password: yup
    .string()
    .test("passwords-match", "Passwords must match", function(value) {
      return this.parent.new_password === value;
    }),
});

export { loginSchema, registerSchema, updateSchema, updatePasswordSchema };
