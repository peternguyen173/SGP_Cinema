import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import HomeSlider from "./components/HomeSlider/HomeSlider";
import MovieCarousel from "./components/MovieCarousel/MovieCarousel";
import MovieCard from "./components/MovieCarousel/MovieCard";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./layouts/Layout";
import Home from "./pages/user/Home/Home";
import MovieDetails from "./pages/user/MovieDetails/MovieDetails";
import SignIn from "./pages/auth/SignIn/SignIn";
import SelectShow from "./pages/user/SelectShow/SelectShow";
import SelectSeat from "./pages/user/SelectSeat/SelectSeat";
import Checkout from "./pages/user/Checkout/Checkout";
import Signup from "./pages/auth/SignUp/SignUp";
import store from "./redux/store";
import Profile from "./pages/user/Profile/Profile";
import BookingHistory from "./pages/user/BookingHistory/BookingHistory";
import {ToastContainer} from "react-toastify"; // Assuming MovieCard is a separate page/component

function App() {
    return (

        <Provider store={store}>
            <ToastContainer />

            <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/movies/:movieId" element={<MovieDetails/>} />
                    <Route path="/movies/:movieId/selectShow" element={<SelectShow/>} />
                    <Route path="/selectseat/:movieId/:showId" element={<SelectSeat/>} />
                    <Route path="/auth/signin" element={<SignIn/>} />
                    <Route path="/checkout/default" element={<Checkout/>} />
                    <Route path="/auth/signup" element={<Signup/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/bookinghistory" element={<BookingHistory/>}/>


                </Routes>
            </Layout>
        </Router>
        </Provider>

    );
}

export default App;
