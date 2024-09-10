'use client';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { BiUserCircle, BiBell } from 'react-icons/bi';
import logo from '../../asset/logo.png';
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser, login } from '../../redux/store';
import { getCurrentUserInfo } from "../../api/authApi";

const Navbar = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const user = useSelector((state) => state.user);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            setUserName(user.fullname);
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/auth/signin";
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = Cookies.get('authToken');
                if (token) {
                    const response = await getCurrentUserInfo(token);
                    dispatch(setUser(response));
                    dispatch(login());
                }
            } catch (error) {
                console.log("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [dispatch]);

    return (
        <nav>
            <div className='left'>
                <img src={logo} alt="logo" width={100} height={100} onClick={() => window.location.href = "/"} />
            </div>
            <div className='right'>
                {isAuthenticated && user ? (
                    <div className="user-info">
                        <a className="q" style={{ cursor: 'pointer' }} href="/bookinghistory">Vé của tôi</a>
                        <BiUserCircle className='theme_icon1' />
                        <a href='/profile'>Xin chào, {userName}!</a>
                        <button className='theme_btn1 linkstylenone' style={{ cursor: 'pointer' }} onClick={handleLogout}> Đăng xuất</button>
                    </div>
                ) : (
                    <div className="user-info">
                        <Link to="/auth/signin" className='theme_btn1 linkstylenone'>
                            Đăng nhập
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
