import { ROLES } from "../utils/roles";

// store user data and token in local storage
export const doLoginLocalStorage = (user, token) => {
  localStorage.setItem("userData", JSON.stringify(user));
  localStorage.setItem("token", JSON.stringify(token));
};

// get user data from local storage
export const getUserFromLocalStorage = () => {
  const data = localStorage.getItem("userData");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

// update access token in local storage
export const updateAccessTokenInLocalStorage=(accessToken)=>{
  const data = localStorage.getItem("token");
  if (data !== null) {
    const token = JSON.parse(data);
    token.accessToken=accessToken;
    localStorage.setItem("token", JSON.stringify(token));
  }
}

// get token from local storage
export const getTokenFromLocalStorage = () => {
  const data = localStorage.getItem("token");
  if (data !== null) {
    return JSON.parse(data);
  } else {
    return null;
  }
};

// check user is logged in or not
export const isLoggedIn = () => {
  if (getTokenFromLocalStorage() !== null) {
    return true;
  } else {
    return false;
  }
};

export const isAdminUser = () => {
  if (isLoggedIn) {
    const roles = getUserFromLocalStorage()?.roles;
    if (roles.find((role) => role.roleName === ROLES.ADMIN)) {
      return true;
    } else {
      return false;
    }
  }
};

// remove user data and token from local storage
export const doLogoutLocalStorage = () => {
  localStorage.removeItem("userData");
  localStorage.removeItem("token");
};
