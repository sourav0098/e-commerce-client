import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Editor } from "@tinymce/tinymce-react";
import {
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
  getImageByProductId,
  getProducts,
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
import { imageSchema } from "../../utils/schema/image.schema";
import { productWithoutFileSchema } from "../../utils/schema/productWithoutFile.schema";

const ViewProducts = () => {
  document.title = "QuickPik | View Products";

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // state for loading
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // state for products
  const [products, setProducts] = useState(null);

  // state for categories
  const [categories, setCategories] = useState(null);

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
        console.log(err);
      })
      .finally(() => {});
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

  // product view modal
  const ProductViewModal = () => {
    // reference to the rich text editor
    const editorRef = useRef(null);

    // reference to the hidden image input element
    const imageRef = useRef(null);

    // state to store the preview image
    const [previewImage, setPreviewImage] = useState(null);

    // state to store selected category id
    const [selectedCategoryChangeId, setSelectedCategoryChangeId] =
      useState(null);

    // formik for image upload
    const imageFormik = useFormik({
      initialValues: {
        image: null,
      },
      validationSchema: imageSchema,
      onSubmit: (values) => {
        // update image logic
        setImageLoading(true);
        uploadProductImage(values.image, selectedProduct?.productId)
          .then(() => {
            toast.success("Product image updated successfully");
          })
          .catch((err) => {
            toast.error("Something went wrong! Unable to update image");
          })
          .finally(() => {
            setImageLoading(false);
          });
      },
    });

    // formik for product details
    const {
      handleSubmit,
      handleChange,
      handleBlur,
      setFieldValue,
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
        description: selectedProduct?.description,
        productImage: selectedProduct?.productImage,
        live: selectedProduct?.live,
        stock: selectedProduct?.stock,
      },
      validationSchema: productWithoutFileSchema,
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
                });
            }
          })
          .catch((err) => {
            console.log(err.response.data);
          })
          .finally(() => {
            setLoading(false);
            handleProductViewClose();
          });
      },
    });

    const handleImageSelection = (e) => {
      const file = e.target.files[0];
      imageFormik.setFieldValue("image", file);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
    };

    // get image for product
    useEffect(() => {
      if (selectedProduct?.productImage != null) {
        getImageByProductId(selectedProduct?.productId)
          .then((data) => {
            const blob = new Blob([data], { type: "image/jpeg" }); // create a Blob object from the ArrayBuffer
            const file = new File([blob], "image.jpg", {
              type: "image/jpeg",
            }); // create a File object from the Blob

            // set image in imageFormik
            imageFormik.setFieldValue("image", file);
            // set image in preview
            setPreviewImage(URL.createObjectURL(file));
          })
          .catch((err) => {
            toast.error("Something went wrong! unable to fetch product image");
          });
      } else {
        setFieldValue("productImage", null);
      }
    }, []);

    return (
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
              {/* Image form */}
              <Form noValidate onSubmit={imageFormik.handleSubmit}>
                <Row>
                  <Col className="text-center mb-3">
                    <Form.Group controlId="formFile" className="mb-3">
                      {/* Image */}
                      <div>
                        {previewImage === null ? (
                          <p>No product image</p>
                        ) : (
                          <img
                            src={previewImage}
                            alt="Profile"
                            width="200px"
                            height="200px"
                            style={{ objectFit: "cover", borderRadius: "50%" }}
                          />
                        )}
                      </div>

                      {/* Hidden Image input */}
                      <Form.Control
                        hidden
                        ref={imageRef}
                        type="file"
                        multiple={false}
                        accept="image/*"
                        onChange={handleImageSelection}
                        onBlur={imageFormik.handleBlur}
                        isInvalid={
                          imageFormik.touched.image &&
                          !!imageFormik.errors.image
                        }
                      />
                      {/* Error message */}
                      <Form.Control.Feedback type="invalid">
                        {imageFormik.errors.image}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {/*Button to trigger the hidden image input */}
                    <Button
                      variant="primary"
                      onClick={() => {
                        imageRef.current.click();
                      }}
                    >
                      Choose image
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {/* Submit button */}
                    <Button
                      variant="primary"
                      className="mb-3"
                      type="submit"
                      disabled={imageLoading}
                    >
                      <Spinner
                        animation="border"
                        as="span"
                        size="sm"
                        className="me-2"
                        // loading state for save button
                        hidden={!imageLoading}
                      ></Spinner>
                      <i
                        className="fa-solid fa-arrow-up-from-bracket me-2"
                        hidden={imageLoading}
                      ></i>
                      <span>Update Image</span>
                    </Button>
                  </Col>
                </Row>
              </Form>
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
            {/* Search Bar */}
            <Row>
              <Col md={4}>
                <Form.Group as={Col} className="mb-3">
                  <Form.Control type="text" placeholder="Search" />
                </Form.Group>
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
