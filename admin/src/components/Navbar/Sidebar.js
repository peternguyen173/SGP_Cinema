import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Sidebar.css';
import Cookies from "js-cookie";
import { useDispatch } from 'react-redux';
import { clearAdmin } from "../../redux/auth/Action";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const dispatch = useDispatch();

    // Check for authToken in cookies and update local state
    useEffect(() => {
        const token = Cookies.get('authToken');
        setIsLoggedIn(!!token); // Set isLoggedIn based on token presence
    }, []); // Empty dependency array to run only on mount

    const toggleSidebar = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);

    };

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const logout = () => {
        Cookies.remove('authToken');
        dispatch(clearAdmin());
        window.location.href = "/";
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h3 className={`sidebar-title ${isOpen ? 'hidden' : ''}`}>SGP Cinema</h3>
                <div className="toggle-btn" onClick={toggleSidebar}>
                    <i className={`fas ${isOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
                </div>
            </div>
            {!isLoggedIn &&
                <ul className="list-unstyled components">
                    <li>
                        <a href="/signin" className="sidebar-link">
                            <i className={`fas fa-sign-in ${isOpen ? 'hidden' : ''}`}></i>
                            <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Login</span>
                        </a>
                    </li>
                </ul>
            }
            {isLoggedIn &&
                <ul className="list-unstyled components">
                    <li>
                        <a href="/" className="sidebar-link">
                            <i className={`fas fa-home ${isOpen ? 'hidden' : ''}`}></i>
                            <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Trang chủ</span>
                        </a>
                    </li>
                    <li>
                        <a href="profile" className="sidebar-link">
                            <i className={`fas fa-user ${isOpen ? 'hidden' : ''}`}></i>
                            <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Tài khoản</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={() => toggleDropdown('phim')} className="sidebar-link">
                            <div className="link-wrapper">
                                <i className={`fas fa-film ${isOpen ? 'hidden' : ''}`}></i>
                                <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Phim</span>
                            </div>
                            <i className={`fas fa-chevron-down dropdown-icon ${activeDropdown === 'phim' ? 'rotate' : ''} ${isOpen ? 'hidden' : ''}`}></i>
                        </a>
                        <ul className={`list-unstyled ${activeDropdown === 'phim' ? 'show' : ''}`}>
                            <li><a href="/createmovie" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Thêm phim</a></li>
                            <li><a href="/managemovie" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Quản lý phim</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" onClick={() => toggleDropdown('phong_chieu')} className="sidebar-link">
                            <div className="link-wrapper">
                                <i className={`fas fa-door-open ${isOpen ? 'hidden' : ''}`}></i>
                                <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Phòng chiếu</span>
                            </div>
                            <i className={`fas fa-chevron-down dropdown-icon ${activeDropdown === 'phong_chieu' ? 'rotate' : ''} ${isOpen ? 'hidden' : ''}`}></i>
                        </a>
                        <ul className={`list-unstyled ${activeDropdown === 'phong_chieu' ? 'show' : ''}`}>
                            <li><a href="/createhall" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Thêm phòng chiếu</a></li>
                            <li><a href="/managehall" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Quản lý phòng chiếu</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" onClick={() => toggleDropdown('schedule')} className="sidebar-link">
                            <div className="link-wrapper">
                                <i className={`fas fa-users ${isOpen ? 'hidden' : ''}`}></i>
                                <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Lịch chiếu</span>
                            </div>
                            <i className={`fas fa-chevron-down dropdown-icon ${activeDropdown === 'schedule' ? 'rotate' : ''} ${isOpen ? 'hidden' : ''}`}></i>
                        </a>
                        <ul className={`list-unstyled ${activeDropdown === 'schedule' ? 'show' : ''}`}>
                            <li><a href="/createschedule" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Thêm lịch chiếu</a></li>
                            <li><a href="/manageschedule" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Quản lý lịch chiếu</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" onClick={() => toggleDropdown('concession')} className="sidebar-link">
                            <div className="link-wrapper">
                                <i className={`fas fa-users ${isOpen ? 'hidden' : ''}`}></i>
                                <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Đồ ăn, nước uống</span>
                            </div>
                            <i className={`fas fa-chevron-down dropdown-icon ${activeDropdown === 'concession' ? 'rotate' : ''} ${isOpen ? 'hidden' : ''}`}></i>
                        </a>
                        <ul className={`list-unstyled ${activeDropdown === 'concession' ? 'show' : ''}`}>
                            <li><a href="/createconcession" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Thêm sản phẩm</a></li>
                            <li><a href="/deleteconcession" className={`dropdown-item ${isOpen ? 'hidden' : ''}`}>Quản lý menu</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" className="sidebar-link" onClick={logout}>
                            <i className={`fas fa-power-off ${isOpen ? 'hidden' : ''}`}></i>
                            <span className={`link-text ${isOpen ? 'hidden' : ''}`}>Logout</span>
                        </a>
                    </li>
                </ul>
            }
        </div>
    );
};

export default Sidebar;
