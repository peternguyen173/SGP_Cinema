import React, { useState } from 'react';
import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon
} from 'mdb-react-ui-kit';
import "./RegisterForm.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const validateInputs = () => {
        let valid = true;
        let usernameError = '';
        let emailError = '';
        let passwordError = '';
        let confirmPasswordError = '';

        // Validate username: only alphanumeric, 4-20 characters
        const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;

        if (!username) {
            usernameError = 'Username is required';
            valid = false;
        } else if (!usernameRegex.test(username)) {
            usernameError = 'Username must be 4-20 characters long and contain only letters and numbers';
            valid = false;
        }

        // Validate email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!email) {
            emailError = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(email)) {
            emailError = 'Email address is invalid';
            valid = false;
        }

        // Validate password
        if (!password) {
            passwordError = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            passwordError = 'Password must be at least 6 characters';
            valid = false;
        }

        // Validate confirm password
        if (confirmPassword !== password) {
            confirmPasswordError = 'Passwords do not match';
            valid = false;
        }

        setErrors({ username: usernameError, email: emailError, password: passwordError, confirmPassword: confirmPasswordError });
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateInputs()) {
            // Handle the registration logic (e.g., call an API)
            console.log('Username:', username);
            console.log('Email:', email);
            console.log('Password:', password);
        }
    };

    return (
        <MDBContainer fluid className="bg-dark" style={{ height: "100vh" }}>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol md='6' lg='4' xl='3'>
                    <MDBCard className='bg-secondary text-white' style={{ borderRadius: '1rem' }}>
                        <MDBCardBody className='p-4'>
                            <h2 className="fw-bold mb-4 text-uppercase text-center">Register</h2>
                            <p className="text-white-50 text-center mb-5">Please enter your details to create an account!</p>
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
                                    <label htmlFor="email" className="form-label text-white">Email address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
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

                                <div className="mb-4 w-100">
                                    <label htmlFor="confirmPassword" className="form-label text-white">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                    />
                                    {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                                </div>

                                <button type="submit" className="custom-register-button">
                                    Register
                                </button>
                            </form>

                            <br />

                            <div className='text-center'>
                                <p className="mb-0">Already have an account? <a href="#!" className="text-white-50 fw-bold">Login</a></p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}

export default RegisterForm;
