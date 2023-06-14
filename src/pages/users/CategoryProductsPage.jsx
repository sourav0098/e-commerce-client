import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from "../../services/categories.service";
import { useState } from "react";
import { toast } from "react-toastify";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { getProductsByCategoryId } from "../../services/product.service";
import { ProductCard } from "../../components/users/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "../../components/Loader";

export const CategoryProductsPage = () => {
  const categoryId = useParams().categoryId;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState(null);

  document.title = `QuickPik | ${category?.categoryTitle}`;

  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  // get category by id
  const fetchCategoryById = async (categoryId) => {
    try {
      const data = await getCategoryById(categoryId);
      setCategory(data);
    } catch (err) {
      toast.error("Something went wrong! unable to fetch category");
    }
  };

  // get products by category id
  const fetchProductsByCategoryId = async (categoryId, currentPage = 0) => {
    try {
      if (currentPage === 0) {
        const data = await getProductsByCategoryId(categoryId, currentPage);
        setProducts(data);
      } else if (currentPage > 0) {
        const data = await getProductsByCategoryId(categoryId, currentPage);
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
    } finally {
      setLoading(false);
    }
  };

  // fetch category by id
  useEffect(() => {
    fetchCategoryById(categoryId);
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategoryId(categoryId, currentPage);
    }
  }, [currentPage, categoryId]);

  // loading next page
  const loadNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      {loading ? (
        <Loader show={loading} />
      ) : (
        <>
          {category && (
            <Container fluid>
              <Row className="mb-4">
                {/* Category Image header */}
                <Col className="p-0">
                  <div
                    className="d-flex justify-content-center align-items-center position-relative"
                    style={{
                      height: "300px",
                    }}
                  >
                    <div
                      className="position-absolute w-100 h-100"
                      style={{
                        backgroundImage: `url(${process.env.REACT_APP_IMAGE_KIT_URL}/categories/${category.categoryImage}?tr=h-200,w-1800)`,
                        backgroundSize: "cover",
                        filter: "brightness(50%)",
                      }}
                    ></div>
                    <div className="position-absolute">
                      <Container className="text-white">
                        <h2 className="fw-semibold">
                          {category.categoryTitle}
                        </h2>
                        <small>{category.description}</small>
                      </Container>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {products &&
            (products.content.length === 0 ? (
              // if no products found
              <div className="text-center mb-3">
                <h3>No products found</h3>
              </div>
            ) : (
              // if products found
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
                <Container>
                  <Row>
                    {products.content.map((product, index) => {
                      return (
                        <ProductCard
                          product={product}
                          key={index}
                        ></ProductCard>
                      );
                    })}
                  </Row>
                </Container>
              </InfiniteScroll>
            ))}
        </>
      )}
    </>
  );
};
