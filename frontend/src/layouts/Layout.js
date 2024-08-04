// Layout.js
import React from 'react';
import Navbar from "../components/Navbar/Navbar";

const Layout = ({ children }) => {

    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
            <div
                style={{
                    bottom: '0',
                    backgroundColor: '#f1f1f1',
                    textAlign: 'center',
                    padding: '10px'
                }}>
                Footer
            </div>
        </div>
    );
};

export default Layout;
