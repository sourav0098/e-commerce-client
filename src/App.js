import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import About from "./pages/about";
import Cart from "./pages/cart";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Products from "./pages/products";
import NavbarMenu from "./components/NavbarMenu";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Register from "./pages/register";

const App = () => {
  return (
    <>
      <NavbarMenu></NavbarMenu>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/services" element={<Services />}></Route>
      </Routes>
      <Footer></Footer>
    </>
  );
};

export default App;
