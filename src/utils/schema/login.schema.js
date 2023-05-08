import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string().required("Please provide an email"),
    password: Yup.string().required("Please provide a password")
});
