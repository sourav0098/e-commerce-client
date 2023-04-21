import { Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import About from "./pages/about";
import Cart from "./pages/cart";
import Services from "./pages/services";
import Contact from "./pages/contact";
import Products from "./pages/products";
import NavbarMenu from "./components/NavbarMenu";

const App = () => {
  return (
    <>
      <NavbarMenu></NavbarMenu>
      <Routes>
        <Route path="/" element={<Index />}></Route>
        <Route path="/products" element={<Products />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/services" element={<Services />}></Route>
      </Routes>
    </>
  );
};

export default App;
