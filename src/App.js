import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import NavbarMenu from "./components/NavbarMenu";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProvider from "./context/user.provider";
import PrivateRoutes from "./components/auth/PrivateRoutes";
import Profile from "./pages/users/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ROLES } from "./utils/roles";
import { AddCategory } from "./pages/admin/AddCategory";
import { AddProduct } from "./pages/admin/AddProduct";
import ViewCategories from "./pages/admin/ViewCategories";

const App = () => {
  return (
    <>
      <UserProvider>
        <NavbarMenu></NavbarMenu>
        <Routes>
          {/* Routes anyone can access*/}
          <Route path="/" element={<Index />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/products" element={<Products />}></Route>

          {/* Routes only admin and logged in user can access*/}
          <Route
            element={
              <PrivateRoutes allowedRole={[ROLES.NORMAL, ROLES.ADMIN]} />
            }
          >
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/cart" element={<Cart />}></Route>
          </Route>

          {/* Routes only admin can access*/}
          <Route element={<PrivateRoutes allowedRole={[ROLES.ADMIN]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
            <Route path="/admin/add-category" element={<AddCategory />}></Route>
            <Route
              path="/admin/categories"
              element={<ViewCategories />}
            ></Route>
            <Route path="/admin/add-product" element={<AddProduct />}></Route>
          </Route>
        </Routes>
        <Footer></Footer>
      </UserProvider>
    </>
  );
};

export default App;
