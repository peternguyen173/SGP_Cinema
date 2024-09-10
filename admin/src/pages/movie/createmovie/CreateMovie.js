'use client'
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './CreateMovie.css';
import {createmovie} from "../../../api/movie";
import Cookies from "js-cookie";

const CreateMovie = () => {
    const [movie, setMovie] = useState({
        title: "",
        description: "",
        durationInMins: 0,
        language: "",
        releaseDate: new Date(),
        country: "",
        image: "",
        large_image: null,
        actors: [],
        genres2: [],
    });

    const genres2 = [
        "Hành động",
        "Hài kịch",
        "Chính kịch",
        "Kỳ ảo",
        "Kinh dị",
        "Khoa học viễn tưởng",
        "Giật gân",
        "Âm nhạc",
    ];

    const handleGenreChange = (genre) => {
        if (movie.genres2.includes(genre)) {
            setMovie({
                ...movie,
                genres2: movie.genres2.filter((selectedGenre) => selectedGenre !== genre),
            });
        } else {
            setMovie({ ...movie, genres2: [...movie.genres2, genre] });
        }
    };

    const [actorName, setActorName] = useState(""); // State to store the new actor name
    const [releaseDate, setReleaseDate] = useState(""); // State for release date

    const handleCastChange = (event) => {
        event.preventDefault(); // Prevent form submission
        if (actorName.trim()) {
            const updatedCast = [...movie.actors, actorName]; // Add new actor name to the cast list
            setMovie({ ...movie, actors: updatedCast });
            setActorName(""); // Reset the actor name input
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1]; // Remove the data URI scheme
                resolve(base64String);
            };
            reader.onerror = reject;
        });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMovie({ ...movie, [name]: value });
    };

    const handleDateChange = (event) => {
        const { value } = event.target;
        setReleaseDate(value);
        setMovie({ ...movie, releasedate: new Date(value) });
    };



    const handleCreateMovie = async (event) => {
        event.preventDefault();
        try{
            const token = Cookies.get("authToken");
            const imageBase64 = movie.image ? await convertToBase64(movie.image) : "";
            const largeImageBase64 = movie.large_image ? await convertToBase64(movie.large_image) : "";

            // Prepare the movie object with Base64 images
            const movieWithImages = {
                ...movie,
                image: imageBase64,
                large_image: largeImageBase64,
            };
            console.log(movieWithImages);
            const response = await createmovie(movieWithImages, token);

            if (response) {
                const data = await response;
                console.log("Movie creation successful", data);

                toast.success("Movie Created Successfully", {
                    position: "top-center",
                });
            } else {
                console.error("Movie creation failed", response);

                // toast.error("Hãy điền đầy đủ các trường thông tin", {
                //     position: "top-center",
                // });
            }
        } catch (error) {
            console.error("An error occurred during movie creation", error);
        }
    };

    return (
        <section>
            <form onSubmit={handleCreateMovie}>
                <div className="formpage">
                    <div className="hu">
                        <div className="hi">
                            <label>Tên phim: </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Tên phim"
                                value={movie.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Quốc gia: </label>
                            <input
                                type="text"
                                placeholder="Quốc gia"
                                name="country"
                                value={movie.country}
                                onChange={handleInputChange} // Using handleInputChange for director field
                            />
                        </div>
                    </div>
                    <br />
                    <div className="hu">
                        <div className="hi">
                            <label>Ngôn ngữ: </label>
                            <input
                                type="text"
                                placeholder="Ngôn ngữ"
                                name="language"
                                value={movie.language}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Ngày ra mắt: </label>
                            <input
                                type="date"
                                placeholder="Ngày ra mắt:"
                                name="releasedate"
                                value={releaseDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Nội dung: </label>
                        <input
                            className="outform"
                            type="text"
                            name="description"
                            placeholder="Nội dung phim"
                            value={movie.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Ảnh đại diện: </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.target.files && event.target.files.length > 0) {
                                    setMovie({ ...movie, image: event.target.files[0] });
                                }
                            }}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Ảnh bìa: </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.target.files && event.target.files.length > 0) {
                                    setMovie({ ...movie, large_image: event.target.files[0] });
                                }
                            }}
                        />
                    </div>
                    <br/>
                    <p>Chọn thể loại:</p>

                    <div className="f">
                        {genres2.map((genre) => (
                            <label className="hh" key={genre}>
                                <input
                                    type="checkbox"
                                    name="genre"
                                    checked={movie.genres2.includes(genre)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Thời lượng: </label>
                        <input
                            type="number"
                            name="durationInMins"
                            placeholder="Thời lượng"
                            value={movie.durationInMins}
                            onChange={handleInputChange}
                        /> phút
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Tên diễn viên: </label>
                        <input
                            type="text"
                            placeholder="Tên diễn viên"
                            onChange={(e) => setActorName(e.target.value)}
                            value={actorName}
                        />
                        <button onClick={handleCastChange}>Thêm diễn viên</button>
                    </div>
                    <div>
                        <p>{movie.actors.join(", ")}</p>
                    </div>
                    <button type="submit">Thêm phim</button>
                </div>
            </form>
            <ToastContainer />
        </section>
    );
};

export default CreateMovie;
