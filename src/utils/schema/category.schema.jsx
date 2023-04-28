import * as Yup from "yup";

export const categorySchema = Yup.object().shape({
  categoryTitle: Yup.string()
    .min(2, "Please provide a category title of atleast 2 characters")
    .required("Please provide a category title"),
  description: Yup.string()
    .min(10, "Please provide a description of atleast 10 characters")
    .required("Please provide a description"),
});