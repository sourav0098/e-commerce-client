import React from "react";
import { getCategories } from "../services/categories.service";
import { useState } from "react";
import { useEffect } from "react";
import { CategoryContext } from "./CategoryContext";

export const CategoryProvider = ({ children }) => {
  // state for categories
  const [categories, setCategories] = useState(null);

  // get categories
  useEffect(() => {
    // get categories from server 1000 page size to get all categories
    getCategories(0, 1000)
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories: categories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
