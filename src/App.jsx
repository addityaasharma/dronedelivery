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
import OrderPage from "./pages/user/product/OrderPage";
import SearchResults from "./pages/user/product/SearchResults";
import CategoryPage from "./pages/user/dashboard/CategoryPage";
import AdminLayout from "./layers/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCollections from "./pages/admin/AdminCollections";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDrones from "./pages/admin/AdminDrones";
import AdminSupport from "./pages/admin/AdminSupport";
import UserSupport from "./pages/user/dashboard/UserSupport";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="category" element={<AdminCategories />} />
        <Route path="collection" element={<AdminCollections />} />
        <Route path="drones" element={<AdminDrones />} />
        <Route path="support" element={<AdminSupport />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/category/:id/:slug" element={<CategoryProducts />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:unique_code/:slug" element={<ProductDetails />} />
        <Route path="/liked-products" element={<LikedProducts />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout/:product_id" element={<CheckoutPage />} />
        <Route path="/collection/:id" element={<CollectionPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/support" element={<UserSupport />} />
      </Route>
    </Routes>
  );
};

export default App;
