import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getUserFromLocalStorage, isLoggedIn } from "../../auth/HelperAuth";

const PrivateRoutes = ({ allowedRole }) => {
  const location = useLocation();

  // Check if the user has the required role
  const isRole = !!getUserFromLocalStorage()?.roles?.find(
    (role) => allowedRole.includes(role.roleName)
  );

  // Render the component if the user has the required role
  return isRole ? (
    <Outlet />
    ) : isLoggedIn() ? (
      // redirect to profile page if the user is logged in but does not have the required role
      <Navigate to="/profile" state={{ from: location }} replace />
      ) : (
    // redirect to login page if the user is not logged in
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default React.memo(PrivateRoutes);
