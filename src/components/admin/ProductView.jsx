import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

export const ProductView = ({ product, index, showProductViewModal }) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const [className, setClassName] = useState("table-success");

  const changeRowColor = () => {
    if (product.live && product.stock) {
      setClassName("table-success");
    } else if (product.live && !product.stock) {
      setClassName("table-warning");
    } else if (!product.live && product.stock) {
      setClassName("table-secondary");
    } else {
      setClassName("table-danger");
    }
  };

  useEffect(() => {
    changeRowColor();
  }, []);

  return (
    <>
      <tr className={className}>
        <td className="small">{index + 1}</td>
        <td className="small">{product?.category?.categoryTitle}</td>
        <td className="small">{product.brand}</td>
        <td className="small">
          {product.title.slice(0, 25)}
          {product.title.length > 25 ? "..." : ""}
        </td>
        <td className="small">$ {product.unitPrice}</td>
        <td className="small">$ {product.discountedPrice}</td>
        <td className="small">{product.quantity}</td>
        <td className="small">{formatDate(product.createdAt)}</td>
        <td className="small">
          <div style={{ minWidth: "80px" }}>
            <Button variant="primary" size="sm" className="me-2" onClick={()=>showProductViewModal(product)}>
              <i className="fa-solid fa-eye me-2"></i>
              <span>View</span>
            </Button>
          </div>
        </td>
      </tr>
    </>
  );
};
