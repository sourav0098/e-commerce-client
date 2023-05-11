import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getProductsLive } from "../../services/product.service";
import { Container, Row, Spinner } from "react-bootstrap";
import { ProductCard } from "../../components/users/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";

export const Products = () => {
  const [products, setProducts] = React.useState(null);

  const [currentPage, setCurrentPage] = useState(0);

  const fetchProductsLive = async (currentPage=0) => {
    try {
      if (currentPage === 0) {
        const data = await getProductsLive(0);
        setProducts(data);
      } else if (currentPage > 0) {
        const data = await getProductsLive(currentPage);
        setProducts({
          content: [...products.content, ...data.content],
          lastPage: data.lastPage,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Something went wrong! unable to fetch products");
    }
  };

  // loading next page
  const loadNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    fetchProductsLive(currentPage);
  }, [currentPage]);

  return (
    products && (
      <InfiniteScroll
        dataLength={products.content.length}
        next={loadNextPage}
        hasMore={!products.lastPage}
        loader={
          <div className="text-center mb-3">
            <Spinner animation="border" as="span" size="lg"></Spinner>
          </div>
        }
      >
        <Container className="mt-4">
          <Row>
            {products.content.map((product, index) => {
              return <ProductCard product={product} key={index}></ProductCard>;
            })}
          </Row>
        </Container>
      </InfiniteScroll>
    )
  );
};
