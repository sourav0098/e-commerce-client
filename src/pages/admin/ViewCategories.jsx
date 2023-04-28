import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useEffect } from "react";
import { getCategories } from "../../services/categories.service";
import { toast } from "react-toastify";

const ViewCategories = () => {
  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({
    content: [],
  });

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((err) => {
        toast.error("Something went wrong! Please try again later");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <SideBar show={show} handleClose={handleClose}></SideBar>;
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
        {categories.length === 0 ? (
          <h3>Loading...</h3>
        ) : (
          <Container>
            <Row xs={1} md={3} xl={4}>
              {categories.content.map((category) => {
                return (
                  <Col className="mb-3" key={category.categoryId}>
                    <Card>
                      <Card.Img
                        variant="top"
                        style={{ height: "150px", objectFit: "cover" }}
                        src="https://randompicturegenerator.com/img/national-park-generator/g44ab0f039fe3369476691d11cb20c038b946a4ebf20e4474b43fc5421c2192a1609b6b72709cdb583cfc2c2bfbbbc5f9_640.jpg"
                      />
                      <Card.Body>
                        <Card.Title>{category.categoryTitle}</Card.Title>
                        <p>
                          {category.description &&
                          category.description.length > 200
                            ? category.description.substr(0, 200) + "..."
                            : category.description}
                        </p>

                        <Button variant="primary" size="sm" className="me-2">
                          View More
                        </Button>
                        <Button variant="danger" size="sm">
                          Delete
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Container>
        )}
      </Container>
    </>
  );
};
export default ViewCategories;
