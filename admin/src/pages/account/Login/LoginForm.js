import React, { useState,useEffect } from 'react';
import Cookies from "js-cookie";
import { useDispatch, useSelector } from 'react-redux';
import { setAdmin } from '../../../redux/auth/Action';
import { signIn } from '../../../api/auth';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody
} from 'mdb-react-ui-kit';
import "./LoginForm.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', password: '' });
    const dispatch = useDispatch();
    const [isSignInSuccess, setIsSignInSuccess] = useState(false); // Track sign-in success
    const authState = useSelector((state) => state.auth);

    // Selector to access Redux state

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const validateInputs = () => {
        let valid = true;
        let usernameError = '';
        let passwordError = '';

        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;

        if (!username) {
            usernameError = 'Username is required';
            valid = false;
        } else if (!usernameRegex.test(username)) {
            usernameError = 'Username must be 4-20 characters long and contain only letters and numbers';
            valid = false;
        }

        if (!password) {
            passwordError = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            passwordError = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors({ username: usernameError, password: passwordError });
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateInputs()) {
            try {
                const response = await signIn(username, password);
                if (response && response.token) {
                    dispatch(setAdmin(response.username));

                    Cookies.set('authToken', response.token, { expires: 7 }); // Set token for 7 days
                    Cookies.set('refreshToken', response.refreshToken, { expires: 7 });

                    // Log Redux state after dispatch
                    setIsSignInSuccess(true);

                    // Redirect after successful login
                   // window.location.href = "/";
                } else {
                    console.error("Login failed: No token received");
                }
            } catch (e) {
                console.error("Login failed:", e);
            }
        }
    };
    useEffect(() => {

            console.log("Redux auth state after login:", authState);
            // Optionally redirect or perform other actions
            // window.location.href = "/";

    }, [authState]);

    return (
        <MDBContainer fluid className="bg-dark" style={{ height: "100vh" }}>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol md='6' lg='4' xl='3'>
                    <MDBCard className='bg-secondary text-white' style={{ borderRadius: '1rem' }}>
                        <MDBCardBody className='p-4'>
                            <h2 className="fw-bold mb-4 text-uppercase text-center">Login</h2>
                            <p className="text-white-50 text-center mb-5">Please enter your login and password!</p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 w-100">
                                    <label htmlFor="username" className="form-label text-white">Username</label>
                                    <input
                                        type="text"
                                        id="username"
                                        className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                    {errors.username && <div className="invalid-feedback d-block">{errors.username}</div>}
                                </div>

                                <div className="mb-4 w-100">
                                    <label htmlFor="password" className="form-label text-white">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                    {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                                </div>

                                <p className="small mb-3 text-center">
                                    <a className="text-white-50" href="#!">Forgot password?</a>
                                </p>

                                <button type="submit" className="custom-login-button">
                                    Login
                                </button>
                            </form>

                            <br />


                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default LoginForm;
