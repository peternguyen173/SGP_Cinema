import React from 'react';
import './CreateSchedule.css';
import { ToastContainer, toast } from 'react-toastify';
import {getAllHalls} from "../../../api/cinemahall";
import {getMovies} from "../../../api/movie";
import {addShow} from "../../../api/cinemashow";
import {useSelector} from "react-redux";


const CreateSchedule = () => {
    const [schedule, setSchedule] = React.useState({
        cinemaID: '',
        movieID: '',
        start_time: ''  // Adjusted to match the request payload
    });

    const [city, setCity] = React.useState('');
    const [screens, setScreens] = React.useState([]);
    const [movies, setMovies] = React.useState([]);
    const [showMovieList, setShowMovieList] = React.useState(false);
    const [showScreenList, setShowScreenList] = React.useState(false);
    const isLoggedIn = useSelector(state => state.auth);

    console.log("sda",isLoggedIn)
    const fetchMovies = async () => {
        try {
            const data = await getMovies();
            setMovies(data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    const fetchScreens = async () => {
        try {
            const data = await getAllHalls(); // Adjust this if the endpoint is different for screens
            setScreens(data);
        } catch (error) {
            console.error("Error fetching screens:", error);
        }
    };

    React.useEffect(() => {
        fetchMovies();
        fetchScreens();
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const handleCreateSchedule = async () => {
        if (!schedule.cinemaID || !schedule.movieID || !schedule.start_time) {
            toast.error("Please fill all the fields");
            return;
        }
        const formattedStartTime = formatDate(schedule.start_time);

        try {
            const response = await addShow({...schedule, start_time:formattedStartTime});
            if (response) {
                toast.success("Schedule created successfully");
            } else {
                toast.error("Schedule creation failed");
            }
        } catch (error) {
            console.error("Error creating schedule:", error);
            toast.error("Schedule creation failed");
        }
    };

    return (
        <div className="formpage">
            <h2>Thêm lịch chiếu mới</h2>

            <button onClick={() => setShowScreenList(!showScreenList)}>
                <h2>Hiển thị các phòng chiếu</h2>
            </button>
            <br/><br/>

            <div className='items' style={{display: showScreenList ? '' : 'none'}}>
                {screens.map((screen, index) => (
                    <div
                        className={schedule.cinemaID === screen.id ? 'item selected' : 'item'}
                        key={index}
                        onClick={() => setSchedule({...schedule, cinemaID: screen.id})}
                    >
                        <p>{screen.name}</p>
                        <p>{screen.screenType}</p>
                    </div>
                ))}
            </div>

            <button onClick={() => setShowMovieList(!showMovieList)}>
                <h2>Hiển thị danh sách phim</h2>
            </button>
            <br/><br/>


            <div className='items' style={{display: showMovieList ? '' : 'none'}}>
                {movies.map((movie, index) => (
                    <div
                        className={schedule.movieID === movie.id ? 'item selected' : 'item'}
                        key={index}
                        onClick={() => setSchedule({...schedule, movieID: movie.id})}
                    >
                        <p>{movie.title}</p>
                    </div>
                ))}
            </div>


            <input
                type="datetime-local"
                name="start_time"
                id="start_time"
                style={{width: '500px'}}  // Thêm width trực tiếp

                onChange={(e) => setSchedule({...schedule, start_time: e.target.value})}
            />
            <br/><br/>

            <button onClick={handleCreateSchedule}>Save</button>
            <ToastContainer/>
        </div>
    );
};

export default CreateSchedule;
