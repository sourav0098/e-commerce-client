import { useEffect } from "react";
import { UserContext } from "./UserContext";
import { useState } from "react";
import { doLoginLocalStorage, doLogoutLocalStorage, getUserFromLocalStorage, isLoggedIn } from "../auth/HelperAuth";

const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(()=>{
    // set login value and user data from local storage (check in auth/helper.auth.js)
    setIsLogin(isLoggedIn);
    setUserData(getUserFromLocalStorage);
  },[])

  // login
  const doLogin = (user, token) => {
    // set user data and token in local storage
    doLoginLocalStorage(user, token);

    // set login value and user data in user context
    setIsLogin(true);
    setUserData(getUserFromLocalStorage)
  }

  // logout
  const doLogout = () => {
    // remove user data and token from local storage
    doLogoutLocalStorage();

    // remove login value and user data in user context
    setIsLogin(false);
    setUserData(null);
  }

  return (
    <UserContext.Provider
      value={{
        userData: userData,
        isLogin: isLogin,
        doLogin: doLogin,
        doLogout: doLogout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
