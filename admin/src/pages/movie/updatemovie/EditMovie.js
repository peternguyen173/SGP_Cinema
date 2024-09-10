"use client";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./EditMovie.css";
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for proper styling
import { getMovieById, getMovies, updatemovie, deleteMovie } from "../../../api/movie"; // Add deleteMovie API

const EditMovie = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState("");
    const [selectedMovie, setSelectedMovie] = useState({
        id: "",
        title: "",
        description: "",
        image: "",
        largeImage: "",
        landscapeImgUrl: "",
        language: "",
        director: "",
        cast: [],
        releaseDate: "",
        genres: [],
        duration: 0,
    });

    const allGenres = [
        "Hành động",
        "Hài kịch",
        "Chính kịch",
        "Kỳ ảo",
        "Kinh dị",
        "Khoa học viễn tưởng",
        "Giật gân",
        "Âm nhạc",
    ];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await getMovies(0, 10000);
                if (response) {
                    setMovies(response);
                } else {
                    toast.error("Failed to fetch movies", {
                        position: "top-center",
                    });
                }
            } catch (error) {
                console.error("Error fetching movies", error);
                toast.error("Error fetching movies", {
                    position: "top-center",
                });
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await getMovieById(selectedMovieId);
                if (response) {
                    console.log(response);
                    setSelectedMovie({
                        ...response,
                        image: response.image ? `data:image/jpeg;base64,${response.image}` : '',
                        largeImage: response.largeImage ? `data:image/jpeg;base64,${response.largeImage}` : '',
                    });
                } else {
                    toast.error("Failed to fetch movie details", {
                        position: "top-center",
                    });
                }
            } catch (error) {
                console.error("Error fetching movie details", error);
                toast.error("Error fetching movie details", {
                    position: "top-center",
                });
            }
        };
        if (selectedMovieId) {
            fetchMovieDetails();
        }
    }, [selectedMovieId]);

    const handleSelectMovie = (movieId) => {
        setSelectedMovieId(movieId);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "genres" || name === "cast") {
            setSelectedMovie({ ...selectedMovie, [name]: value.split(',') });
        } else if (name === "duration") {
            setSelectedMovie({ ...selectedMovie, [name]: Number(value) });
        } else {
            setSelectedMovie({ ...selectedMovie, [name]: value });
        }
    };

    const handleDeleteMovie = async (movieId) => {
        try {
            const response = await deleteMovie(movieId);
            if (response) {
                toast.success("Movie deleted successfully", {
                    position: "top-center",
                });
                setMovies(movies.filter(movie => movie.id !== movieId));
            } else {
                toast.error("Failed to delete movie", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error deleting movie", error);
            toast.error("Error deleting movie", {
                position: "top-center",
            });
        }
    };

    const handlePortraitImgChange = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const base64Image = await convertToBase64(file);
        setSelectedMovie({ ...selectedMovie, image: file});
        }
    };

    const handleLandscapeImgChange = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const base64Image = await convertToBase64(file);
            setSelectedMovie({ ...selectedMovie, largeImage: file });
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as yyyy-MM-dd
    };


    const handleUpdateMovie = async () => {
        try {
            console.log(selectedMovie);

            const updatedMovie = { ...selectedMovie, genres2: selectedMovie.genres};
            updatedMovie.genres = null;

            if (updatedMovie.image && updatedMovie.image.startsWith('data:image')) {
                updatedMovie.image = updatedMovie.image.replace(/^data:image\/[^;]+;base64,/, '');
            }
            if (updatedMovie.largeImage && updatedMovie.largeImage.startsWith('data:image')) {
                updatedMovie.largeImage = updatedMovie.largeImage.replace(/^data:image\/[^;]+;base64,/, '');
            }
            // Convert images to base64 only if they are files
            if (updatedMovie.image instanceof File) {
                updatedMovie.image = await convertToBase64(updatedMovie.image);
            }
            if (updatedMovie.largeImage instanceof File) {
                updatedMovie.largeImage = await convertToBase64(updatedMovie.largeImage);
            }

            console.log("Portrait Image Base64:", updatedMovie);

            // Update movie
            const response = await updatemovie(updatedMovie);
            console.log(updatedMovie);
            if (response) {
                toast.success("Movie updated successfully", {
                    position: "top-center",
                });
            } else {
                toast.error("Failed to update movie", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error updating movie", error);
            toast.error("Error updating movie", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="edit-movie-page">
            <br />
            <br />

            {movies.length > 0 && (
                <div className="fl-table">
                    <table id="customers">
                        <thead>
                        <h2>Danh sách các phim</h2>
                        <tr>
                            <th>Tên phim</th>
                            <th>Chỉnh sửa</th>
                            <th>Xóa</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.title}</td>
                                <td>
                                    <button onClick={() => handleSelectMovie(movie.id)}>
                                        Chỉnh sửa
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleDeleteMovie(movie.id)}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedMovie.id && (
                <section>
                    <form>
                        <div className="formpage">
                            <div className="hu">
                                <div className="hi">
                                    <label>Tên</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={selectedMovie.title}
                                        onChange={handleInputChange}
                                    />
                                </div>

                            </div>
                            <br />
                            <div className="hu">
                                <div className="hi">
                                    <label>Ngôn ngữ</label>
                                    <input
                                        type="text"
                                        name="language"
                                        value={selectedMovie.language}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Khởi chiếu</label>
                                    <input
                                        type="date"
                                        name="releaseDate"
                                        value={formatDate(selectedMovie.releaseDate)}
                                        onChange={handleInputChange}
                                    />

                                </div>
                            </div>
                            <br/>
                            <div className="ntd3">
                            <label>Mô tả</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={selectedMovie.description}
                                    onChange={handleInputChange}
                                />
                                <br/>
                                <label>Ảnh đại diện</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePortraitImgChange}
                                />
                                {selectedMovie.image && (
                                    <img src={selectedMovie.image} alt="Portrait"
                                         style={{width: "200px", height: "200px"}}/>
                                )}
                                <br/>
                                <label>Ảnh bìa</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLandscapeImgChange}
                                />
                                {selectedMovie.largeImage && (
                                    <img src={selectedMovie.largeImage} alt="Landscape"
                                         style={{width: "200px", height: "200px"}}/>
                                )}

                                <br/>
                                <label>Thể loại</label>
                                <div>
                                    {allGenres.map((genre) => (
                                        <label key={genre}>
                                            <input
                                                type="checkbox"
                                                checked={selectedMovie.genres.includes(genre)}
                                                onChange={() => {
                                                    const updatedGenres = selectedMovie.genres.includes(genre)
                                                        ? selectedMovie.genres.filter(g => g !== genre)
                                                        : [...selectedMovie.genres, genre];
                                                    setSelectedMovie({...selectedMovie, genres: updatedGenres});
                                                }}
                                            />
                                            {genre}
                                        </label>
                                    ))}
                                </div>

                                <label>Thời lượng</label>
                                <input
                                    type="number"
                                    name="duration"
                                    value={selectedMovie.durationInMins.toString()}
                                    onChange={handleInputChange}
                                />
                                <br/>
                                <label>Diễn viên</label>
                                <input
                                    type="text"
                                    name="cast"
                                    value={selectedMovie.actors.join(',')}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <br/>
                            <button type="button" onClick={handleUpdateMovie}>Lưu thay đổi</button>
                        </div>
                    </form>
                </section>
            )}
            <ToastContainer/>
        </div>
    );
};

export default EditMovie;
