import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
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
import ViewProducts from "./pages/admin/ViewProducts";
import ViewOrders from "./pages/admin/ViewOrders";
import ViewUsers from "./pages/admin/ViewUsers";
import { useState } from "react";
import { CategorySideBar } from "./components/CategorySideBar";
import { useEffect } from "react";
import { getCategories } from "./services/categories.service";
import { CategoryProductsPage } from "./pages/users/CategoryProductsPage";
import { Products } from "./pages/users/Products";
import { SingleProductPage } from "./pages/users/SingleProductPage";
import { CartProvider } from "./context/cart.provider";
import { ShoppingCart } from "./pages/users/ShoppingCart";

const App = () => {
  // state for category sidebar
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);

  // state for categories
  const [categories, setCategories] = useState(null);

  // functions for category sidebar
  const handleCloseCategorySidebar = () => setShowCategorySidebar(false);
  const handleShowCategorySidebar = () => setShowCategorySidebar(true);

  // get categories
  useEffect(() => {
    // get categories from server 1000 page size to get all categories
    getCategories(0, 1000)
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <UserProvider>
        <CartProvider>
          <NavbarMenu
            handleShowCategorySidebar={handleShowCategorySidebar}
          ></NavbarMenu>
          <CategorySideBar
            categories={categories}
            showCategorySideBar={showCategorySidebar}
            handleCloseCategorySideBar={handleCloseCategorySidebar}
          ></CategorySideBar>
          <Routes>
            {/* Routes anyone can access*/}
            <Route path="/" element={<Index />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/products" element={<Products />}></Route>
            <Route
              path="/product/:productId"
              element={<SingleProductPage />}
            ></Route>
            <Route
              path="/category/:categoryId/products"
              element={<CategoryProductsPage />}
            ></Route>

            {/* Routes only admin and logged in user can access*/}
            <Route
              element={
                <PrivateRoutes allowedRole={[ROLES.NORMAL, ROLES.ADMIN]} />
              }
            >
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/cart" element={<ShoppingCart />}></Route>
            </Route>

            {/* Routes only admin can access*/}
            <Route element={<PrivateRoutes allowedRole={[ROLES.ADMIN]} />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              ></Route>
              <Route
                path="/admin/add-category"
                element={<AddCategory />}
              ></Route>
              <Route
                path="/admin/categories"
                element={<ViewCategories />}
              ></Route>
              <Route path="/admin/add-product" element={<AddProduct />}></Route>
              <Route path="/admin/products" element={<ViewProducts />}></Route>
              <Route path="/admin/orders" element={<ViewOrders />}></Route>
              <Route path="/admin/users" element={<ViewUsers />}></Route>
            </Route>
          </Routes>
          <Footer></Footer>
        </CartProvider>
      </UserProvider>
    </>
  );
};

export default App;
