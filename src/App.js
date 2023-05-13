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
import { ROLES } from "./utils/roles";
import { AddCategory } from "./pages/admin/AddCategory";
import { AddProduct } from "./pages/admin/AddProduct";
import ViewCategories from "./pages/admin/ViewCategories";
import ViewProducts from "./pages/admin/ViewProducts";
import ViewOrders from "./pages/admin/ViewOrders";
import ViewUsers from "./pages/admin/ViewUsers";
import { useState } from "react";
import { CategorySideBar } from "./components/CategorySideBar";
import { CategoryProductsPage } from "./pages/users/CategoryProductsPage";
import { Products } from "./pages/users/Products";
import { SingleProductPage } from "./pages/users/SingleProductPage";
import { CartProvider } from "./context/cart.provider";
import { ShoppingCart } from "./pages/users/ShoppingCart";
import { OrderCheckout } from "./pages/users/OrderCheckout";
import { Orders } from "./pages/users/Orders";
import { OrderDetail } from "./pages/users/OrderDetail";
import { CategoryProvider } from "./context/category.provider";
import { Loader } from "./components/Loader";
import { useLoader } from "./hooks/useLoader";

const App = () => {
  const loading = useLoader();

  // state for category sidebar
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);

  // functions for category sidebar
  const handleCloseCategorySidebar = () => setShowCategorySidebar(false);
  const handleShowCategorySidebar = () => setShowCategorySidebar(true);

  return (
    <>
      <UserProvider>
        <CartProvider>
          <CategoryProvider>
            <NavbarMenu
              handleShowCategorySidebar={handleShowCategorySidebar}
            ></NavbarMenu>
            <CategorySideBar
              showCategorySideBar={showCategorySidebar}
              handleCloseCategorySideBar={handleCloseCategorySidebar}
            ></CategorySideBar>
            <Loader show={loading}></Loader>
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
                <Route path="/place-order" element={<OrderCheckout />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/order/:orderId" element={<OrderDetail />}></Route>
              </Route>

              {/* Routes only admin can access*/}
              <Route element={<PrivateRoutes allowedRole={[ROLES.ADMIN]} />}>
                <Route
                  path="/admin/add-category"
                  element={<AddCategory />}
                ></Route>
                <Route
                  path="/admin/categories"
                  element={<ViewCategories />}
                ></Route>
                <Route
                  path="/admin/add-product"
                  element={<AddProduct />}
                ></Route>
                <Route
                  path="/admin/products"
                  element={<ViewProducts />}
                ></Route>
                <Route path="/admin/orders" element={<ViewOrders />}></Route>
                <Route path="/admin/users" element={<ViewUsers />}></Route>
              </Route>
            </Routes>
            <Footer></Footer>
          </CategoryProvider>
        </CartProvider>
      </UserProvider>
    </>
  );
};

export default App;
