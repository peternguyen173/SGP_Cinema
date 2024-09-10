"use client";
import React, { useEffect, useState } from 'react';
import "./SignUp.css";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from '../../../asset/logo.png';
import 'react-toastify/dist/ReactToastify.css';
import { signup } from "../../../api/authApi";

export default function Signup() {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        address: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    useEffect(() => console.log("form", formData), [formData]);

    const signUp = async (formData) => {
        const { confirmPassword, ...signupData } = formData; // Exclude confirmPassword from the request payload
        console.log(signupData);
        try {
            const response = await signup(signupData);
            console.log("response" + response.status);

            if (response.status === "OK") {
                toast(response.message, {
                    position: 'top-right',
                    type: 'success',
                    autoClose: 2000,
                });

                setFormData({
                    fullname: '',
                    username: '',
                    email: '',
                    address: '',
                    phone: '',
                    password: '',
                    confirmPassword: '',
                });
            } else {
                toast(response.message, {
                    type: 'error',
                    position: 'top-right',
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.log("error" + error.response.data.message);

            if (error.response && error.response.data) {
                toast(error.response.data.message, {
                    type: 'error',
                    position: 'top-right',
                    autoClose: 3000,
                });
            } else {
                toast('An error occurred. Please try again.', {
                    type: 'error',
                    position: 'top-right',
                    autoClose: 2000,
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const validationErrors = {};
        if (!formData.username) {
            validationErrors.username = 'Username is required';
        }
        if (!formData.fullname) {
            validationErrors.fullname = 'Name is required';
        }
        if (!formData.email) {
            validationErrors.email = 'Email is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }
        if (formData.password !== formData.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        } else {
            signUp(formData);
        }
    };

    return (
        <div className='authout-sigin'>
            <div className='authin-sigin'>
                <div className="left">
                    <img src={logo} alt="" className='img' />
                </div>
                <div className='right'>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <div className="forminput_cont">
                            <div><label>Tên đăng nhập</label></div>
                            <div><input
                                type="text"
                                placeholder="Tên đăng nhập"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                                {errors.username && <span className="formerror">{errors.username}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Tên</label></div>
                            <div><input
                                type="text"
                                placeholder="Tên"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                            />
                                {errors.fullname && <span className="formerror">{errors.fullname}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Số điện thoại</label></div>
                            <div><input
                                type="number"
                                placeholder="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Địa chỉ</label></div>
                            <div><input
                                type="text"
                                placeholder="Địa chỉ"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Email</label></div>
                            <div><input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                                {errors.email && <span className="formerror">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Mật khẩu</label></div>
                            <div><input
                                type="password"
                                placeholder="Mật khẩu"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                                {errors.password && (
                                    <span className="formerror">{errors.password}</span>
                                )}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Xác nhận mật khẩu</label></div>
                            <div><input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                                {errors.confirmPassword && (
                                    <span className="formerror">{errors.confirmPassword}</span>
                                )}
                            </div>
                        </div>
                        <div className="forminput_cont">

                        </div>

                        <button type="submit" className="main_button">Đăng ký</button>
                        <p className='authlink'>Bạn đã có tài khoản? <Link to="/auth/signin">Đăng nhập</Link></p>
                    </form>
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}
