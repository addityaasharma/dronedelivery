import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/user/auth/Login";
import Dashboard from "./pages/user/dashboard/Dashboard";
import TrackOrder from "./pages/user/dashboard/TrackOrder";
import Profile from "./pages/user/Profile";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/user/product/ProductDetails";
import LikedProducts from "./pages/user/product/LikedProducts";
import CartPage from "./pages/user/product/CartPage";
import CheckoutPage from "./pages/user/product/CheckoutPage";
import CollectionPage from "./pages/user/dashboard/CollectionPage";
import MainLayout from "./layers/MainLayout";
import OrderPage from "./pages/user/product/Orderpage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:product_id" element={<ProductDetails />} />
        <Route path="/liked-products" element={<LikedProducts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/:product_id" element={<CheckoutPage />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Route>
    </Routes>
  );
};

export default App;
