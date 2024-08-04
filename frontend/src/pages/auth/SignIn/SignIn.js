'use client'
import React, { useState } from 'react';
import Navbar from "../../../components/Navbar/Navbar";
import './SignIn.css';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../../asset/logo.png';

import Cookies from 'js-cookie';
import {signInWithEmailAndPassword} from "../../../api/authApi";
// Define an interface for the form data

export default function SignIn() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!formData.username) {
            validationErrors.username = 'Username is required';
        }
        if (!formData.password) {
            validationErrors.password = 'Password is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const response =  await signInWithEmailAndPassword(formData);
        console.log(response);

        if (response.username) {
            toast(response.message, {
                type: 'success',
                position: 'top-right',
                autoClose: 2000
            })
            Cookies.set('authToken', response.token, { expires: 7 });
            Cookies.set('refreshToken', response.refreshToken, { expires: 7 });
            console.log(response);
            //window.location.href = "/";
            //  await setCookie('authToken', response.data.token)
            //  await setCookie('refreshToken', response.data.refreshToken)
            // const authToken = await getCookie('token');
            // console.log('My Cookie Value:', authToken);
        } else {
            toast(response, {
                type: 'error',
                position: 'top-right',
                autoClose: 2000
            });
        }

    };

    // const checkLogin = async () => {
    //     // let authToken = await getCookie('authToken')
    //     // let refreshToken = await getCookie('refreshToken')
    //
    //     fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         credentials: 'include',
    //
    //     })
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((response) => {
    //             console.log('check login res ', response)
    //
    //             if (response.ok) {
    //
    //                 if (typeof window !== 'undefined') {
    //                     window.location.href = "/"
    //                 }
    //
    //
    //             } else {
    //                 // toast(response.message, {
    //                 //     type: 'error',
    //                 //     position: 'top-right',
    //                 //     autoClose: 2000
    //                 // });
    //             }
    //         })
    //         .catch((error) => {
    //             if (typeof window !== 'undefined') {
    //                 window.location.href = "/"
    //             }
    //         })
    // };

    return (
        <div className='authout'>
            <div className='authin'>
                <div className="left">
                    <img src={logo} alt="" className='img' />
                </div>
                <div className='right'>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        onSubmit={handleSubmit}
                    >
                        <div className="forminput_cont">
                            <div><label>Email</label></div>
                            <div><input
                                className='input_field'
                                type="text"
                                placeholder="Nhập email"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                                {errors.username && <span className="formerror">{errors.email}</span>}
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Mật khẩu</label></div>
                            <div> <input
                                className='input_field'
                                type="password"
                                placeholder="Nhập mật khẩu"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                                {errors.password && (
                                    <span className="formerror">{errors.password}</span>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="main_button">
                            ĐĂNG NHẬP
                        </button>
                        {/*<button type="submit" className="main_button"  onClick={handleGoogleSubmit}>*/}
                        {/*    <span>  ĐĂNG NHẬP VỚI GOOGLE </span>*/}
                        {/*</button>*/}

                        <p className="authlink">
                            Bạn chưa có tài khoản? <Link href="/auth/signup">Đăng ký</Link>
                        </p>
                    </form>

                </div>
            </div>
        </div>
    )
}