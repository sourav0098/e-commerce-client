import * as Yup from "yup";

// Define an array of supported file formats
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];

export const imageSchema = Yup.object().shape({
  // Define a validation rule for the "image" field
  image: Yup.mixed()
    .nullable()
    .required("Please select an image") // Field is required
    .test(
      "FILE_SIZE",
      "File size is too large (max 2MB)", // Custom error message for the validation rule
      (value) => !value || (value && value.size <= 2048 * 1024) // Rule checks that file size is <= 2MB
    )
    .test(
      "FILE_FORMAT",
      "Uploaded format is not supported", // Custom error message for the validation rule
      (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type)) // Rule checks that the file is one of the supported formats
    )
});
