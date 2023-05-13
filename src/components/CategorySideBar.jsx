import React from "react";
import { Nav, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CategoryContext } from "../context/CategoryContext";
import { useContext } from "react";

export const CategorySideBar = ({
  showCategorySideBar,
  handleCloseCategorySideBar,
}) => {
  const { categories } = useContext(CategoryContext);

  return (
    <Offcanvas
      show={showCategorySideBar}
      onHide={handleCloseCategorySideBar}
      scroll={true}
      style={{
        backgroundColor: "var(--primary-color)",
        color: "white",
        maxWidth: "220px",
      }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Categories</Offcanvas.Title>
      </Offcanvas.Header>
      {categories && (
        <Offcanvas.Body className="p-0">
          <ul className="list-group">
            {categories && categories?.content.map((category, index) => {
              return (
                <Nav.Link
                  key={index}
                  as={NavLink}
                  to={`/category/${category.categoryId}/products`}
                  onClick={handleCloseCategorySideBar}
                  className="list-group-item sidebar-item"
                >
                  <span>{category.categoryTitle}</span>
                </Nav.Link>
              );
            })}
          </ul>
        </Offcanvas.Body>
      )}
    </Offcanvas>
  );
};
