import * as Yup from "yup";
import { REGEX_VALIDATIONS } from "../regex";

export const profileSchema = Yup.object().shape({
  fname: Yup.string()
    .min(1, "First Name need atleast 1 characters")
    .required("Please provide a first name"),
  lname: Yup.string()
    .min(2, "Last Name need atleast 2 characters")
    .required("Please provide a last name"),
  phone: Yup.string()
    .matches(
      REGEX_VALIDATIONS.PHONE,
      "Please provide a valid 10 digit phone number"
    )
    .required("Please provide a phone number"),
  address: Yup.string(),
  postalCode: Yup.string().matches(
    REGEX_VALIDATIONS.POSTAL_CODE,
    "Please provide a valid postal code"
  ),
  city: Yup.string(),
  province: Yup.string(),
});
