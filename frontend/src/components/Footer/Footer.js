import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="footer-title">About Us</h2>
                    <p>
                        SGP Cinema is your go-to platform for booking tickets for the latest movies.<br/> We offer a seamless and easy-to-use interface for a hassle-free booking experience.
                    </p>
                </div>
                <div className="footer-section links">
                    <h2 className="footer-title">Quick Links</h2>
                    <ul>
                        <li><a href="/home">Home</a></li>
                        <li><a href="/about">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-section contact">
                    <h2 className="footer-title">Contact Us</h2>
                    <p>Email: dinhtuandungnguyen@gmail.com</p>
                    <p>Phone: 0999 999 999</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 IT1 GROUP. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
