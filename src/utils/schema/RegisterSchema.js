import * as Yup from "yup";
import { REGEX_VALIDATIONS } from "../regex";

export const registerSchema = Yup.object().shape({
  fname: Yup.string().required("Please provide a first name"),
  lname: Yup.string().required("Please provide a last name"),
  email: Yup.string()
    .email("Please provide a valid email")
    .required("Please provide an email"),
  password: Yup.string()
    .min(8, "Password should be atleast 8 characacters")
    .matches(
      REGEX_VALIDATIONS.PASSWORD,
      "Password should contain atleast one uppercase, one lowercase, one number and one special character"
    )
    .required("Please provide a password"),
  cpassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});
