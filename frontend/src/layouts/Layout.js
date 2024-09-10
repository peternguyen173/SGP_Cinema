// Layout.js
import React from 'react';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./Layout.css"
const Layout = ({ children }) => {

    return (
        <div className="layout">
            <Navbar/>
            <main className="content">
                {children}
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;
