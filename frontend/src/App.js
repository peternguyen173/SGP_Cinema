import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomeSlider from "./components/HomeSlider/HomeSlider";
import MovieCarousel from "./components/MovieCarousel/MovieCarousel";
import MovieCard from "./components/MovieCarousel/MovieCard";
import Navbar from "./components/Navbar/Navbar";
import Layout from "./layouts/Layout";
import Home from "./pages/user/Home/Home";
import MovieDetails from "./pages/user/MovieDetails/MovieDetails";
import SignIn from "./pages/auth/SignIn/SignIn";
import SelectShow from "./pages/user/SelectShow/SelectShow";
import SelectSeat from "./pages/user/SelectSeat/SelectSeat"; // Assuming MovieCard is a separate page/component

function App() {
    return (

        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/movies/:movieId" element={<MovieDetails/>} />
                    <Route path="/movies/:movieId/selectShow" element={<SelectShow/>} />
                    <Route path="/selectseat/:movieId/:showId" element={<SelectSeat/>} />
                    <Route path="/auth/signin" element={<SignIn/>} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
