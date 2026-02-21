import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../pages/user/dashboard/Header"
import MobileBottomNav from "../pages/user/dashboard/MobileBottomNav";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="pt-0">
                <Outlet />
            </main>
            <MobileBottomNav/>
        </div>
    );
};

export default MainLayout;
