import React, { useState } from "react";
import { SideBar } from "../../components/SideBar";
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
import { API_ENDPOINTS } from "../../services/helper.service";
import { getAllUsers, searchUserByFname } from "../../services/user.service";
import { UserView } from "../../components/admin/UserView";
import { IKContext, IKImage } from "imagekitio-react";
import { toast } from "react-toastify";

const ViewUsers = () => {
  document.title = "QuickPik | Users";

  const [users, setUsers] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  // state for previous users when searching
  const [previousUsers, setPreviousUsers] = useState(null);

   // search users
   const [searchQuery, setSearchQuery] = useState("");

  // state to show/hide sidebar
  const [show, setShow] = useState(false);

  // methods for sidebar
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getUsers();
  }, []);

  // get users
  const getUsers = async (
    pageNumber = 0,
    pageSize = API_ENDPOINTS.USER_PAGE_SIZE,
    sortBy = "fname",
    sortDir = "asc"
  ) => {
    try {
      const data = await getAllUsers(pageNumber, pageSize, sortBy, sortDir);
      setUsers(data);
    } catch (error) {
      toast.error("Something went wrong! Please try after some time");
    }
  };

  // search users
  const searchUser = async (fname) => {
    try {
      const data =await searchUserByFname(fname);
      if (data.content.length <= 0) {
        toast.info("No results found!");
      }
      setPreviousUsers(users);
      setUsers(data);
    } catch (error) {
      toast.error("Something went wrong! Please try after some time");
    }
  }

  // search user submi form handler
  const searchUserHandler = (e) => {
    e.preventDefault();
    if (searchQuery === undefined || searchQuery.trim() === "") {
      return;
    }else{
      searchUser(searchQuery);
    }
  };

  // state for user modal
  const [showUserModal, setShowUserModal] = useState(false);

  // methods for user modal
  const handleUserModalClose = () => setShowUserModal(false);
  const handleUserModalShow = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const UserViewModal = () => {
    return (
      selectedUser && (
        <Modal show={showUserModal} onHide={handleUserModalClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* User Details */}
            <Container>
              <Row>
                <Col>
                  {selectedUser.image == null ? (
                    <p>No image found</p>
                  ) : (
                    <div className="text-center mb-3">
                      <IKContext
                        urlEndpoint={process.env.REACT_APP_IMAGE_KIT_URL}
                        publicKey={process.env.REACT_APP_IMAGE_KIT_PUBLIC_KEY}
                      >
                        <IKImage
                          path={`/users/${selectedUser.image}`}
                          transformation={[
                            {
                              height: 400,
                              width: 400,
                            },
                          ]}
                          loading="lazy"
                          width="200px"
                          height="200px"
                          style={{ objectFit: "cover", borderRadius: "50%" }}
                        />
                      </IKContext>
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>
                    {selectedUser?.fname} {selectedUser?.lname}
                  </h5>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>Email: {selectedUser?.email} </p>
                </Col>
                <Col>
                  <p>Phone: {selectedUser?.phone} </p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>Address: {selectedUser?.address}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <p>City: {selectedUser?.city}</p>
                </Col>
                <Col>
                  <p>Province: {selectedUser?.province}</p>
                </Col>
                <Col>
                  <p>Postal Code: {selectedUser?.postalCode}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  {selectedUser.roles.map((role, index) => {
                    return <p key={index}>Role: {role.roleName}</p>;
                  })}
                </Col>
              </Row>
            </Container>
            <Button variant="secondary" onClick={handleUserModalClose}>
              Close
            </Button>
          </Modal.Body>
        </Modal>
      )
    );
  };

  return (
    <>
      <UserViewModal />
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
              Users
            </h2>
            <hr />
          </Col>
        </Row>
        {users == null ? (
          <div className="text-center mb-3">
            <Spinner animation="border" as="span" size="lg"></Spinner>
          </div>
        ) : (
          <Container>
          {/* Search User */}
            <Row>
              <Col md={4}>
                <Form onSubmit={searchUserHandler}>
                  <Form.Group as={Col} className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search User"
                        onChange={(e) => {
                          if (e.target.value.trim() === "") {
                            setSearchQuery("");
                            setUsers(previousUsers);
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
            </Row>
            <Row>
              <Col>
                <Table responsive hover size="sm">
                  <thead>
                    <tr>
                      <th className="small">S. No.</th>
                      <th className="small">First Name</th>
                      <th className="small">Last Name</th>
                      <th className="small">Email</th>
                      <th className="small">Phone</th>
                      <th className="small">Role</th>
                      <th className="small">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.content.map((user, index) => {
                      return (
                        <UserView
                          user={user}
                          index={index}
                          key={index}
                          handleUserModalShow={handleUserModalShow}
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
                    <Pagination.First onClick={() => getUsers(0)} />
                    <Pagination.Prev
                      disabled={users.pageNumber === 0}
                      onClick={() => {
                        if (users.pageNumber === 0) {
                          return;
                        } else {
                          getUsers(users.pageNumber - 1);
                        }
                      }}
                    />

                    {/* If the current page is the first page or the second page, we show the first three pages (page 1, page 2, and page 3)
                        If the current page is the last page or the second-last page, we show the last three pages (page n-2, page n-1, and page n)
                        If the current page is somewhere in between, we show the current page and the two adjacent pages (page k-1, page k, and page k+1) */}
                    {(() => {
                      const totalPages = users.totalPages;
                      const currentPage = users.pageNumber;

                      if (totalPages <= 3) {
                        // Show all pages if there are 3 or fewer
                        return [...Array(totalPages)].map((ob, i) => (
                          <Pagination.Item
                            key={i}
                            active={i === currentPage}
                            onClick={() => getUsers(i)}
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
                              onClick={() => getUsers(startPage - 1)}
                            />
                          )}

                          {/* Render 3 pages */}
                          {[...Array(3)].map((ob, i) => (
                            <Pagination.Item
                              key={startPage + i}
                              active={startPage + i === currentPage}
                              onClick={() => getUsers(startPage + i)}
                            >
                              {startPage + i + 1}
                            </Pagination.Item>
                          ))}

                          {/* Render last page if it's not the last one */}
                          {endPage < totalPages - 1 && (
                            <Pagination.Ellipsis
                              onClick={() => getUsers(endPage + 1)}
                            />
                          )}
                        </>
                      );
                    })()}

                    <Pagination.Next
                      disabled={users.lastPage}
                      onClick={() => {
                        if (users.lastPage) return;
                        else {
                          getUsers(users.pageNumber + 1);
                        }
                      }}
                    />
                    <Pagination.Last
                      onClick={() => getUsers(users.totalPages - 1)}
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
export default ViewUsers;
