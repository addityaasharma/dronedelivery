import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../pages/user/dashboard/Header"

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="pt-16">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
