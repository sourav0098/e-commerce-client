import * as Yup from "yup";

export const productWithoutFileSchema = Yup.object().shape({
  brand: Yup.string().required("Please provide a brand name"),
  title: Yup.string()
    .min(2, "Please provide a valid product name of atleast 2 characters")
    .required("Please provide a product name"),
  unitPrice: Yup.number()
    .required("Please provide a unit price")
    .min(0, "Unit price must be greater than 0")
    .max(9999999.99, "Unit price cannot be greater than 9999999 .99")
    .test(
      "decimal-check",
      "Unit price should be only up to 2 decimal places",
      (value) => {
        if (value !== undefined && value !== null) {
          const decimalPlaces = value.toString().split(".")[1];
          return decimalPlaces === undefined || decimalPlaces.length <= 2;
        }
        return true;
      }
    ),
  discountedPrice: Yup.number()
    .nullable()
    .min(0, "Discounted price must be greater than 0")
    .max(9999999.99, "Discounted price cannot be greater than 9999999 .99")
    .test(
      "decimal-check",
      "Discounted price should be only up to 2 decimal places",
      (value) => {
        if (value !== undefined && value !== null) {
          const decimalPlaces = value.toString().split(".")[1];
          return decimalPlaces === undefined || decimalPlaces.length <= 2;
        }
        return true;
      }
    ),
  quantity: Yup.number()
    .required("Please provide some stock quantity")
    .min(0, "Stock Quantity must be greater than or equal to 0")
    .integer("Stock Quantity should be a whole number")
    .typeError("Stock Quantity should be a whole number"),
  description: Yup.string()
    .min(10, "Please provide a valid description of atleast 10 characters")
    .required("Please provide a description"),
  live: Yup.boolean(),
  stock: Yup.boolean(),
  productImage: Yup.string().nullable(),
});
