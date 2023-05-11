import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { ROLES } from "../../utils/roles";

export const UserView = ({ user, index, handleUserModalShow }) => {
  const [className, setClassName] = useState(null);

  const changeRowColor = () => {
    if (user.roles.some(role => role.roleName === ROLES.ADMIN)) {
      setClassName('table-success');
    } else {
      setClassName(null);
    }
  }
  

  useEffect(() => {
    changeRowColor();
  }, []);

  return (
    user && (
      <tr className={className}>
        <td className="small">{index + 1}</td>
        <td className="small">{user.fname}</td>
        <td className="small">{user.lname}</td>
        <td className="small">{user.email}</td>
        <td className="small">{user.phone}</td>
        {user.roles.map((role, index) => {
          return (
            <td className="small" key={index}>
              {role.roleName}
            </td>
          );
        })}
        <td className="small">
          <div style={{ minWidth: "80px" }}>
            <Button
              variant="primary"
              size="sm"
              className="me-2"
              onClick={() => {
                handleUserModalShow(user);
              }}
            >
              <i className="fa-solid fa-eye me-2"></i>
              <span>View</span>
            </Button>
          </div>
        </td>
      </tr>
    )
  );
};
