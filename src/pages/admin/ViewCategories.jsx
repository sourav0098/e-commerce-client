import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect } from "react";
import {
  deleteCategory,
  getCategories,
  updateCategory,
  uploadCategoryImage,
} from "../../services/categories.service";
import { toast } from "react-toastify";
import { CategoryView } from "../../components/admin/CategoryView";
import { categorySchema } from "../../utils/schema/CategorySchema";
import { useFormik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";
import { CategoryImageUpload } from "../../components/admin/CategoryImageUpload";

const ViewCategories = () => {
  document.title = "QuickPik | View Categories";

  const deleteIcon = {
    margin: "20px",
    border: "4px solid",
    padding: "10px 14px",
    borderRadius: "50%",
  };

  // state to show/hide sidebar
  const [show, setShow] = useState(false);
  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // state to store the category id to be deleted
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);

  // state to store the categories
  const [categories, setCategories] = useState({
    content: [],
  });

  // state to show/hide delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // state to show/hide category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  // method to show delete modal
  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = (categoryId) => {
    setShowDeleteModal(true);
    setDeleteCategoryId(categoryId);
  };

  // method to show category modal
  const handleCategoryModalClose = () => setShowCategoryModal(false);
  const handleCategoryModalShow = (category) => {
    setShowCategoryModal(true);
    setSelectedCategory(category);
  };

  // method to upload category iamge
  const handleUploadCategoryImage = (image, categoryId) => {
    return uploadCategoryImage(image, categoryId)
      .then((res) => {
        toast.success("Image updated successfully");
        // update the category in the state
        const newArray = categories.content.map((c) => {
          if (c.categoryId === categoryId) {
            c.categoryImage = res.message;
          }
          return c;
        });
        setCategories({ ...categories, content: newArray });
      })
      .catch((err) => {
        toast.error("Error uploading image");
      });
  };

  // method to delete category
  const removeCategory = () => {
    deleteCategory(deleteCategoryId)
      .then((data) => {
        toast.success("Category deleted successfully");
        // remove the deleted category from the category state
        const newArray = categories.content.filter((c) => {
          return c.categoryId !== deleteCategoryId;
        });
        setCategories({ ...categories, content: newArray });
      })
      .catch((err) => {
        toast.error("Something went wrong! Please try again later");
      })
      .finally(() => {
        handleDeleteModalClose();
      });
  };

  // method to load more categories(next page)
  const loadNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // method to load more categories(next page)
  useEffect(() => {
    // if current page is 0 (initial load) then fetch the categories
    if (currentPage === 0) {
      setLoading(true);
      // fetch the categories
      getCategories()
        .then((data) => {
          setCategories(data);
        })
        .catch(() => {
          toast.error("Something went wrong! Please try again later");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // if current page is greater than 0 then fetch the next page
    else if (currentPage > 0) {
      getCategories(currentPage)
        .then((data) => {
          // update the categories state and append the new categories
          setCategories({
            content: [...categories.content, ...data.content],
            lastPage: data.lastPage,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalElements: data.totalElements,
            totalPages: data.totalPages,
          });
        })
        .catch(() => {
          toast.error("Something went wrong! Please try again later");
        });
    }
  }, [currentPage]);

  // Category Details Modal
  const ViewCategoryModal = () => {
    // formik for category details
    const { handleSubmit, handleChange, handleBlur, values, touched, errors } =
      useFormik({
        initialValues: {
          categoryTitle: selectedCategory?.categoryTitle,
          description: selectedCategory?.description,
        },
        validationSchema: categorySchema,
        onSubmit: (values) => {
          // update category
          setLoading(true);
          updateCategory(selectedCategory.categoryId, values)
            .then((data) => {
              // close the modal
              handleCategoryModalClose();
              toast.success("Category updated successfully");
              // update the category in the state
              const newArray = categories.content.map((c) => {
                if (c.categoryId === selectedCategory.categoryId) {
                  c.categoryTitle = data.categoryTitle;
                  c.description = data.description;
                }
                return c;
              });
              setCategories({ ...categories, content: newArray });
            })
            .catch((err) => {
              console.log(err.response);
            })
            .finally(() => {
              setLoading(false);
            });
        },
      });

    return (
      <>
        <Modal show={showCategoryModal} onHide={handleCategoryModalClose}>
          <Modal.Header>
            <Modal.Title>Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Category Image Upload Component */}
            <CategoryImageUpload
              image={selectedCategory?.categoryImage}
              categoryId={selectedCategory?.categoryId}
              handleUploadCategoryImage={handleUploadCategoryImage}
            />
            {/* Category Details Form */}
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Form.Group as={Col} controlId="categoryTitle" className="mb-3">
                  <Form.Label>Category Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Category Title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryTitle}
                    isInvalid={touched.categoryTitle && !!errors.categoryTitle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.categoryTitle}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} controlId="description" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    placeholder="Provide a clear and concise description of your product category"
                    rows={8}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    isInvalid={touched.description && !!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
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
                  // loading state for save button
                  hidden={!loading}
                ></Spinner>
                <span>Update</span>
              </Button>
              <Button variant="secondary" onClick={handleCategoryModalClose}>
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <>
      {/* Category Details Modal */}
      <ViewCategoryModal />
      {/* Delete category modal confirmation */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Body>
          <div className="text-center text-danger fs-2 border--2">
            <i className="fa-solid fa-x" style={deleteIcon}></i>
          </div>
          <h5>Are you sure you want to delete this category?</h5>
          <p>
            Deleting this category will also delete all the products associated
            with it. Please confirm you want to proceed
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleDeleteModalClose}
          >
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={removeCategory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Sidebar */}
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
              Categories
            </h2>
            <hr />
          </Col>
        </Row>

        {/* Loading spinner */}
        {loading ? (
          <div className="text-center mb-3">
            <Spinner animation="border" as="span" size="lg"></Spinner>
          </div>
        ) : categories.content.length === 0 ? (
          <div className="text-center mb-3">
            <h3>No categories found!</h3>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={categories.content.length}
            next={loadNextPage}
            hasMore={!categories.lastPage}
            loader={
              <div className="text-center mb-3">
                <Spinner animation="border" as="span" size="lg"></Spinner>
              </div>
            }
          >
            <Container>
              <Row xs={1} md={2} lg={3} xl={4}>
                {categories.content.map((category) => {
                  return (
                    <CategoryView
                      category={category}
                      key={category.categoryId}
                      showDeleteModal={handleDeleteModalShow}
                      showCategoryModal={handleCategoryModalShow}
                    />
                  );
                })}
              </Row>
            </Container>
          </InfiniteScroll>
        )}
      </Container>
    </>
  );
};
export default ViewCategories;
