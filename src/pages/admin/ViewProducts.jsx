import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Editor } from "@tinymce/tinymce-react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useEffect } from "react";
import {
  getProducts,
  searchProducts,
  updateProduct,
  updateProductCategory,
  uploadProductImage,
} from "../../services/product.service";
import { toast } from "react-toastify";
import { ProductView } from "../../components/admin/ProductView";
import { API_ENDPOINTS } from "../../services/helper.service";
import { useFormik } from "formik";
import { useRef } from "react";
import { getCategories } from "../../services/categories.service";
import { productSchema } from "../../utils/schema/ProductSchema";
import { ProductImageUpload } from "../../components/admin/ProductImageUpload";

const ViewProducts = () => {
  document.title = "QuickPik | View Products";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // state for loading
  const [loading, setLoading] = useState(false);

  // state for products
  const [products, setProducts] = useState(null);

  // state for categories
  const [categories, setCategories] = useState(null);

  // search products
  const [searchQuery, setSearchQuery] = useState("");

  // state for previous products when searching
  const [previousProducts, setPreviousProducts] = useState(null);

  // state for selected product in product view modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // state for product view modal
  const [showProductView, setShowProductView] = useState(false);

  // methods for product view modal
  const handleProductViewClose = () => setShowProductView(false);
  const handleProductViewShow = () => setShowProductView(true);

  const showProductViewModal = (product) => {
    setSelectedProduct(product);
    handleProductViewShow();
  };

  // initial render get all products and categories
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // get all products
  const getAllProducts = (
    pageNumber = 0,
    pageSize = API_ENDPOINTS.PRODUCT_PAGE_SIZE,
    sortBy = "createdAt",
    sortDir = "asc"
  ) => {
    getProducts(pageNumber, pageSize, sortBy, sortDir)
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        toast.error("Something went wrong! unable to fetch products");
      });
  };

  // get all categories
  const getAllCategories = () => {
    getCategories(0, 100)
      .then((data) => {
        setCategories(data.content);
      })
      .catch((err) => {
        toast.error("Something went wrong! Unable to fetch categories");
      });
  };

  // search product
  const searchProduct = (e) => {
    e.preventDefault();
    if (searchQuery === undefined || searchQuery.trim() === "") {
      return;
    } else {
      // call server api to search product
      searchProducts(searchQuery)
        .then((data) => {
          if (data.content.length <= 0) {
            toast.info("No results found!");
          }
          setPreviousProducts(products);
          setProducts(data);
        })
        .catch((err) => {
          toast.error("Something went wrong! Unable to search products");
        })
        .finally(() => {});
    }
  };

  // product view modal
  const ProductViewModal = () => {
    // reference to the rich text editor
    const editorRef = useRef(null);

    // Server side validation error
    const [serverError, setServerError] = useState(null);

    // state to store selected category id
    const [selectedCategoryChangeId, setSelectedCategoryChangeId] =
      useState(null);

    // formik for product details
    const {
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldTouched,
      values,
      touched,
      errors,
    } = useFormik({
      initialValues: {
        brand: selectedProduct?.brand,
        title: selectedProduct?.title,
        unitPrice: selectedProduct?.unitPrice,
        discountedPrice: selectedProduct?.discountedPrice,
        quantity: selectedProduct?.quantity,
        shortDescription: selectedProduct?.shortDescription,
        description: selectedProduct?.description,
        live: selectedProduct?.live,
        stock: selectedProduct?.stock,
      },
      validationSchema: productSchema,
      onSubmit: (values) => {
        // update product details without image
        setLoading(true);
        updateProduct(values, selectedProduct?.productId)
          .then((data) => {
            toast.success("Product updated successfully");
            const newArray = products.content.map((p) => {
              if (p.productId === selectedProduct.productId) {
                return data;
              }
              return p;
            });
            setProducts({ ...products, content: newArray });
            // update category if changed
            if (
              selectedCategoryChangeId != null &&
              selectedCategoryChangeId !== selectedProduct?.category?.categoryId
            ) {
              // update category
              updateProductCategory(
                selectedCategoryChangeId,
                selectedProduct?.productId
              )
                .then((data) => {
                  toast.success("Category updated successfully");
                  const newArray = products.content.map((p) => {
                    if (p.productId === selectedProduct.productId) {
                      return data;
                    }
                    return p;
                  });
                  setProducts({ ...products, content: newArray });
                })
                .catch((err) => {
                  toast.error(
                    "Something went wrong! Unable to update category"
                  );
                  // server validation errors
                  if (err?.response?.data?.message) {
                    setServerError(err.response.data.message);
                  } else if (err?.response?.data?.errors) {
                    setServerError(err.response.data.errors);
                  }
                  window.scrollTo(0, 0); // scroll to top of page
                });
            }
          })
          .catch((err) => {
            // server validation errors
            if (err?.response?.data?.message) {
              setServerError(err.response.data.message);
            } else if (err?.response?.data?.errors) {
              setServerError(err.response.data.errors);
            } else {
              toast.error("Something went wrong! Unable to update product");
            }
            window.scrollTo(0, 0); // scroll to top of page
          })
          .finally(() => {
            setLoading(false);
            handleProductViewClose();
          });
      },
    });

    // method to upload product image
    const handleUploadProductImage = (image, productId) => {
      return uploadProductImage(image, productId)
        .then((res) => {
          toast.success("Image updated successfully");
          // update the product in the state
          const newArray = products.content.map((p) => {
            if (p.productId === productId) {
              p.productImage = res.message;
            }
            return p;
          });
          setProducts({ ...products, content: newArray });
        })
        .catch((err) => {
          toast.error("Error uploading image");
        });
    };

    return (
      //  Modal for product view
      selectedProduct && (
        <>
          <Modal
            show={showProductView}
            onHide={handleProductViewClose}
            size="lg"
          >
            <Modal.Header>
              <Modal.Title>Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* server side validation alert */}
              {serverError && (
                <Row>
                  <Col>
                    {typeof serverError === "string" ? (
                      <Alert variant="danger" className="p-2 mt-2">
                        {serverError}
                      </Alert>
                    ) : (
                      <Alert variant="danger" className="p-2 mt-2">
                        <ul>
                          {serverError.map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </Alert>
                    )}
                  </Col>
                </Row>
              )}

              {/* Image upload component */}
              <ProductImageUpload
                image={selectedProduct?.productImage}
                productId={selectedProduct?.productId}
                handleUploadProductImage={handleUploadProductImage}
              />
              <hr />
              {/* Product Details Form Fields */}
              <Form noValidate onSubmit={handleSubmit}>
                <Row>
                  {/* Product Category */}
                  <Form.Group
                    as={Col}
                    controlId="category"
                    md={6}
                    className="mb-3"
                  >
                    <Form.Label>Product Category</Form.Label>
                    <Form.Select
                      onChange={(e) =>
                        setSelectedCategoryChangeId(e.target.value)
                      }
                      value={
                        selectedCategoryChangeId !== null
                          ? selectedCategoryChangeId
                          : selectedProduct?.category?.categoryId
                      }
                    >
                      {categories ? (
                        <>
                          {/* Show category options */}
                          {categories.map((category) => {
                            return (
                              <option
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.categoryTitle}
                              </option>
                            );
                          })}
                        </>
                      ) : (
                        <option value="none">None</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="brand"
                    className="mb-3"
                    md={6}
                  >
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Brand"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.brand}
                      isInvalid={touched.brand && !!errors.brand}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.brand}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="title"
                    className="mb-3"
                    md={6}
                  >
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Product Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.title}
                      isInvalid={touched.title && !!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.title}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                {/* Price row */}
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="unitPrice"
                    md={4}
                    className="mb-3"
                  >
                    <Form.Label>Unit Price</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Unit Price"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.unitPrice}
                        isInvalid={touched.unitPrice && !!errors.unitPrice}
                      />
                      <InputGroup.Text>CAD</InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.unitPrice}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="discountedPrice"
                    md={4}
                    className="mb-3"
                  >
                    <Form.Label>Discounted Price</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Discounted Price"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.discountedPrice}
                        isInvalid={
                          touched.discountedPrice && !!errors.discountedPrice
                        }
                      />
                      <InputGroup.Text>CAD</InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.discountedPrice}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="quantity"
                    md={4}
                    className="mb-3"
                  >
                    <Form.Label>Stock Quantity</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Stock Quantity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.quantity}
                      isInvalid={touched.quantity && !!errors.quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.quantity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="shortDescription"
                    className="mb-3"
                  >
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Short Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.shortDescription}
                      isInvalid={
                        touched.shortDescription && !!errors.shortDescription
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shortDescription}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                {/* Product Description Row (TinyMCE) */}
                <Row>
                  <Form.Group
                    as={Col}
                    controlId="description"
                    md={12}
                    className="mb-3"
                  >
                    <Form.Label>Description</Form.Label>
                    <Editor
                      apiKey={process.env.REACT_APP_TINYMCE_KEY}
                      onInit={(evt, editor) => (editorRef.current = editor)}
                      value={values.description}
                      init={{
                        selector: "textarea#basic-example",
                        icons: "bootstrap",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "fullscreen",
                          "insertdatetime",
                          "table",
                          "help",
                        ],
                        toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | ltr rtl',
                        browser_spellcheck: true,
                        autosave_interval: "30s",
                        content_style: `
                        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
                        body { font-family: 'Roboto', sans-serif; }`,
                      }}
                      onEditorChange={(e) => {
                        handleChange({
                          target: { name: "description", value: e },
                        });
                      }}
                      onBlur={() => setFieldTouched("description", true)}
                    ></Editor>
                    {touched.description && errors.description && (
                      <div
                        className="text-danger"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {errors.description}
                      </div>
                    )}
                  </Form.Group>
                </Row>

                <Row>
                  <Form.Group as={Col} md={2} className="mb-3">
                    <Form.Check
                      type="switch"
                      id="live"
                      label="Live"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.live}
                      checked={values.live}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={2} className="mb-3">
                    <Form.Check
                      type="switch"
                      id="stock"
                      label="In Stock"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.stock}
                      checked={values.stock}
                    />
                  </Form.Group>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="me-2"
                >
                  <Spinner
                    animation="border"
                    as="span"
                    size="sm"
                    className="me-3"
                    hidden={!loading}
                  ></Spinner>
                  <span>Update</span>
                </Button>
                <Button variant="secondary" onClick={handleProductViewClose}>
                  Close
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      )
    );
  };

  return (
    <>
      <ProductViewModal />
      <SideBar show={show} handleClose={handleClose}></SideBar>
      <Container>
        <Row>
          <Col>
            <h2 className="mt-3">
              <i
                className="fa-solid fa-bars me-2"
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              ></i>
              Products
            </h2>
            <hr />
          </Col>
        </Row>
        {products == null ? (
          <div className="text-center mb-3">
            <Spinner animation="border" as="span" size="lg"></Spinner>
          </div>
        ) : (
          <Container>
            {/* Search Bar and Color for different product status */}
            <Row>
              <Col md={4}>
                <Form onSubmit={searchProduct}>
                  <Form.Group as={Col} className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search Product"
                        onChange={(e) => {
                          if (e.target.value.trim() === "") {
                            setSearchQuery("");
                            setProducts(previousProducts);
                          } else {
                            setSearchQuery(e.target.value);
                          }
                        }}
                        value={searchQuery}
                      />
                      <Button variant="primary" type="submit">
                        Search
                      </Button>
                    </InputGroup>
                  </Form.Group>
                </Form>
              </Col>
              <Row className="mb-3">
                <Col md={3}>
                  <i className="fa-solid fa-circle bg-success-table me-2"></i>
                  <small className="me-3">Live & In Stock</small>
                </Col>
                <Col md={3}>
                  <i className="fa-solid fa-circle bg-warning-table me-2"></i>
                  <small className="me-3">Live & Not in Stock</small>
                </Col>
                <Col md={3}>
                  <i className="fa-solid fa-circle bg-secondary-table me-2"></i>
                  <small className="me-3">Not Live & In Stock</small>
                </Col>
                <Col md={3}>
                  <i className="fa-solid fa-circle bg-danger-table me-2"></i>
                  <small className="me-3">Not Live & Not in Stock</small>
                </Col>
              </Row>
            </Row>
            <Row>
              <Col>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th className="small">S. No.</th>
                      <th className="small">Category</th>
                      <th className="small">Brand</th>
                      <th className="small">Product Name</th>
                      <th className="small">Unit Price</th>
                      <th className="small">Disounted Price</th>
                      <th className="small">Quantity</th>
                      <th className="small">Added Date</th>
                      <th className="small">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.content.map((product, index) => {
                      return (
                        <ProductView
                          product={product}
                          index={index}
                          key={product.productId}
                          showProductViewModal={showProductViewModal}
                        />
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            {/* Pagination */}
            <Row>
              <Col style={{ textAlign: "right" }}>
                <div className="d-inline-block">
                  {/* Pagination */}
                  <Pagination>
                    <Pagination.First onClick={() => getAllProducts(0)} />
                    <Pagination.Prev
                      disabled={products.pageNumber === 0}
                      onClick={() => {
                        if (products.pageNumber === 0) {
                          return;
                        } else {
                          getAllProducts(products.pageNumber - 1);
                        }
                      }}
                    />

                    {/* If the current page is the first page or the second page, we show the first three pages (page 1, page 2, and page 3)
                        If the current page is the last page or the second-last page, we show the last three pages (page n-2, page n-1, and page n)
                        If the current page is somewhere in between, we show the current page and the two adjacent pages (page k-1, page k, and page k+1) */}
                    {(() => {
                      const totalPages = products.totalPages;
                      const currentPage = products.pageNumber;

                      if (totalPages <= 3) {
                        // Show all pages if there are 3 or fewer
                        return [...Array(totalPages)].map((ob, i) => (
                          <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => getAllProducts(i)}
                          >
                            {i + 1}
                          </Pagination.Item>
                        ));
                      }

                      // Show 3 pages based on current page
                      let startPage = 0;
                      let endPage = 0;

                      if (currentPage <= 1) {
                        startPage = 0;
                        endPage = 2;
                      } else if (currentPage >= totalPages - 2) {
                        startPage = totalPages - 3;
                        endPage = totalPages - 1;
                      } else {
                        startPage = currentPage - 1;
                        endPage = currentPage + 1;
                      }

                      return (
                        <>
                          {/* Render first page if it's not the first one */}
                          {startPage > 0 && (
                            <Pagination.Ellipsis
                              onClick={() => getAllProducts(startPage - 1)}
                            />
                          )}

                          {/* Render 3 pages */}
                          {[...Array(3)].map((ob, i) => (
                            <Pagination.Item
                              key={startPage + i}
                              active={startPage + i === currentPage}
                              onClick={() => getAllProducts(startPage + i)}
                            >
                              {startPage + i + 1}
                            </Pagination.Item>
                          ))}

                          {/* Render last page if it's not the last one */}
                          {endPage < totalPages - 1 && (
                            <Pagination.Ellipsis
                              onClick={() => getAllProducts(endPage + 1)}
                            />
                          )}
                        </>
                      );
                    })()}

                    <Pagination.Next
                      disabled={products.lastPage}
                      onClick={() => {
                        if (products.lastPage) return;
                        else {
                          getAllProducts(products.pageNumber + 1);
                        }
                      }}
                    />
                    <Pagination.Last
                      onClick={() => getAllProducts(products.totalPages - 1)}
                    />
                  </Pagination>
                </div>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
};
export default ViewProducts;
