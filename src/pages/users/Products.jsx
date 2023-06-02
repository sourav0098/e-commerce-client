import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getProductsLive } from "../../services/product.service";
import { Container, Row, Spinner } from "react-bootstrap";
import { ProductCard } from "../../components/users/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/Loader";

export const Products = () => {
  document.title =
    "QuickPik | Discover the Latest Smartphones, Laptops, and More";
  const [products, setProducts] = React.useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const fetchProductsLive = async (currentPage = 0) => {
    try {
      if (currentPage === 0) {
        const data = await getProductsLive(0);
        setProducts(data);
        setLoading(false);
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

  return loading ? (
    <Loader show={loading} />
  ) : (
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
