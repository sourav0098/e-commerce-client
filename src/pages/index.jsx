import React from "react";
import Hero from "../components/Hero";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Index() {
  const showSuccessToast = () => {
    toast.success('Wow so easy!', {
      theme: "light",
      });
  }

  return (
    <Hero
      title={"QuickPik"}
      description={
        "Welcome to QuickPik, your one-stop-shop for the latest electronics. Browse our selection of smartphones, laptops, smart home devices, and more. Our easy-to-use platform makes it simple to find and purchase the products you need. Plus, enjoy exceptional customer service and support from our dedicated team. Discover the QuickPik difference and start shopping for your favorite electronics today!"
      }
    >
      <div>
        <h1>Home Page</h1>
        <Button variant="success" onClick={showSuccessToast}>Testing</Button>
      </div>
    </Hero>
  );
}
