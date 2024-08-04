"use client";
import React, { useState, useEffect } from 'react';
import {Link, NavLink} from 'react-router-dom';
import './Navbar.css';
import { BiUserCircle, BiBell } from 'react-icons/bi';
import logo from '../../asset/logo.png';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import Cookies from "js-cookie";
import {getCurrentUserInfo} from "../../api/authApi";


const Navbar = () => {
    const [showLocationPopup, setShowLocationPopup] = useState(false);
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);

    const [loggedIn, setLoggedIn] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [shouldReload, setShouldReload] = useState(false);
    const [googleUser, setGoogleUser] = useState(null);





    // useEffect(() => {
    //     const socket = io("http://localhost:8000"); // Connect to Socket.IO server
    //     socket.on('connect', () => {
    //         console.log('Connected to Socket.IO server');
    //     });
    //
    //     socket.on('bookingConfirmed', (data) => {
    //         console.log('New notification received:', data.message);
    //         console.log(userId);
    //         console.log(data.userId);
    //
    //         const newNotification = {
    //             _id: '', // Phải điền giá trị cho _id
    //             userId: data.userId,
    //             message: data.message,
    //             isRead: false, // Có thể đặt giá trị mặc định cho isRead
    //             timestamp: new Date() // Đặt thời gian cho timestamp
    //         };
    //
    //         // Kiểm tra xem thông báo có userId của người dùng hiện tại hay không
    //         if (newNotification.userId === userId) {
    //             setShouldReload(true); // Đánh dấu để reload component
    //             // Cập nhật notifications với một mảng mới
    //             setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    //             if (!newNotification.isRead) {
    //                 setUnreadNotifications(prevCount => prevCount + 1);
    //             }
    //             setShowNotifications(true);
    //             fetchNotifications();
    //         }
    //     });




    //     // Fetch initial notifications
    //     fetchNotifications();
    //     const notificationIcon = document.querySelector('.notification-icon');
    //     if (notificationIcon) {
    //         notificationIcon.classList.add('has-unread');
    //         // Cập nhật badge thông báo (nếu có)
    //         const notificationBadge = notificationIcon.querySelector('.notification-badge');
    //         if (notificationBadge) {
    //             notificationBadge.textContent = unreadNotifications.toString();
    //         }
    //     }
    //     // Cleanup on component unmount
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [user]);

    useEffect(() => {
            // Fetch lại notifications và các thông tin cần thiết khác
            fetchNotifications();
            getUser(); // Ví dụ: gọi lại API để lấy thông tin người dùng
            // Reset shouldReload về false sau khi đã xử lý
        }
    , []); // Chỉ chạy lại khi shouldReload thay đổi

    const getUser = async () => {
        try {
            const token = Cookies.get('authToken');
           // console.log("token:" +token);
            if (token) {
                const response = await getCurrentUserInfo(token);
                setUser(response);
                setUserId(response.id);
                setLoggedIn(true);
              //  console.log("user id" + userId);

            }
        } catch (error) {
            console.log("Error fetching user:", error);
        }
    };
    useEffect(() => {
        //console.log("User ID after state update:", userId);
    }, [userId]);

    const handleLogout = () => {
        Cookies.remove('authToken');

        setUser(null);
        setUserId(null);
        setLoggedIn(false);
        setNotifications([]);
        setUnreadNotifications(0);

        window.location.href="/auth/signin"
    };


    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/getnoti`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            const response = await res.json();
            const fetchedNotifications = response.data;
            setNotifications(fetchedNotifications.slice(0, 5)); // Get the latest 5 notifications
            const unreadCount = fetchedNotifications.filter((noti) => !noti.isRead).length;
            setUnreadNotifications(unreadCount);
        } catch (error) {
            console.log(error);
        }
    };


    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        if (unreadNotifications > 0) {
            setUnreadNotifications(0);
        }
    };

    const handleNotificationItemClick = async (notificationId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/notifications/update/${notificationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isRead: true })
            });

            if (!response.ok) {
                throw new Error(`Failed to update notification: ${response.statusText}`);
            }

            setNotifications(prevNotifications => prevNotifications.map(noti =>
                noti._id === notificationId ? { ...noti, isRead: true } : noti
            ));
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    useEffect(() => {
        // Chờ cho đến khi component được mount và các phần tử đã được tạo ra
        const updateNotificationIcon = () => {
            const notificationIcon = document.querySelector('.notification-icon');
            if (notificationIcon) {
                if (unreadNotifications > 0) {
                    notificationIcon.classList.add('has-unread');
                } else {
                    notificationIcon.classList.remove('has-unread');
                }

                // Cập nhật badge thông báo (nếu có)
                const notificationBadge = notificationIcon.querySelector('.notification-badge');
                if (notificationBadge) {
                    notificationBadge.textContent = unreadNotifications.toString();
                }
            } else {
                // Nếu phần tử chưa tồn tại, thử lại sau một khoảng thời gian ngắn
                setTimeout(updateNotificationIcon, 100); // Thử lại sau 100ms
            }
        };

        updateNotificationIcon(); // Gọi hàm cập nhật lần đầu
    }, [unreadNotifications]); // Gọi lại khi unreadNotifications thay đổi

    return (
        <nav>
            <div className='left'>
                <img src={logo} alt="logo" width={100} height={100} onClick={() => window.location.href = "/"} />
            </div>

            <div className='right'>
                {loggedIn && user ? (
                        <div className="user-info">
                            <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>

                            <BiUserCircle className='theme_icon1' />
                            <a href='/profile'>Xin chào, {user.fullname}! </a>
                            <div className={`notification-icon ${unreadNotifications > 0 ? 'has-unread' : ''}`} onClick={handleNotificationClick}>
                                <BiBell className='theme_icon1' />
                                {unreadNotifications > 0 && (
                                    <span className="notification-badge">{unreadNotifications}</span>
                                )}
                            </div>
                            {showNotifications && (
                                <div className="notifications-dropdown">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification, index) => (
                                            <Link href="/bookingdata">
                                                <div
                                                    key={index}
                                                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                                    onClick={() => handleNotificationItemClick(notification._id)}
                                                >
                                                    {notification.message}
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="notification-item">No notifications</div>
                                    )}
                                </div>
                            )}
                            <button className='theme_btn1 linkstylenone' style={{ cursor: 'pointer' }} onClick={handleLogout}> Đăng xuất</button>
                        </div>
                    ) :


                    (
                        <>

                            { googleUser ? (
                                    <>
                                        <div className="user-info">
                                            <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>
                                            <div className='fd'><BiUserCircle className='theme_icon1' /></div>
                                            <Link href='/profile'>Xin chào, {googleUser.displayName}! </Link>

                                            <button className='theme_btn1 linkstylenone' style={{ cursor: 'pointer' }} onClick={handleGoolgeLogout}>Đăng xuất</button>
                                        </div>
                                    </>
                                ) :
                                (
                                    <div className="user-info">
                                        <a className="q" style={{ cursor: 'pointer' }} href="/promotion">Tin tức, ưu đãi</a>
                                        <Link to="/auth/signin" className='theme_btn1 linkstylenone'>
                                            Đăng nhập
                                        </Link>
                                    </div>
                                )}
                        </>
                    )}

            </div>
        </nav>
    );
};

export default Navbar;