import * as yup from "yup";

const FILE_SIZE = 50 * 1024 * 1024;

const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const createSchema = yup.object().shape({
  description: yup
    .string()
    .required()
    .min(5),
  file: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File too large, accepting maximum of 50mb",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format, accepted formats are image/png, jpeg, jpg, webp",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
});

export { createSchema };
