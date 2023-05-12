import * as Yup from "yup";
import { REGEX_VALIDATIONS } from "../regex";

export const placeOrderSchema = Yup.object().shape({
  orderName: Yup.string()
    .min(1, "Name need atleast 1 character")
    .required("Please provide a name"),
  shippingAddress: Yup.string().required("Please provide a shipping adress"),
  postalCode: Yup.string()
    .matches(
      REGEX_VALIDATIONS.POSTAL_CODE,
      "Please provide a valid postal code"
    )
    .required("Please provide a postal code"),
  city: Yup.string().required("Please provide a city"),
  province: Yup.string().required("Please provide a province"),
  shippingPhone: Yup.string()
    .matches(
      REGEX_VALIDATIONS.PHONE,
      "Please provide a valid 10 digit phone number"
    )
    .required("Please provide a phone number"),
});
