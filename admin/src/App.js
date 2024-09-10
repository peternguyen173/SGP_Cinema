import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Layout from "./Layout/Layout";
import Navbar from "./components/Navbar/Sidebar";
import Sidebar from "./components/Navbar/Sidebar";
import LoginForm from "./pages/account/Login/LoginForm";
import RegisterForm from "./pages/account/Register/ResigterForm";
import CreateMovie from "./pages/movie/createmovie/CreateMovie";
import EditMovie from "./pages/movie/updatemovie/EditMovie";
import CreateHall from "./pages/cinemahall/createhall/CreateHall";
import UpdateHall from "./pages/cinemahall/updatehall/UpdateHall";
import EditHall from "./pages/cinemahall/edithall/EditHall";
import CreateSchedule from "./pages/schedule/createschedule/CreateSchedule";
import ManageSchedule from "./pages/schedule/manageschedule/ManageSchedule";
import Profile from "./pages/profile/Profile";
import CreateConcession from "./pages/concession/createconcession/CreateConcession";
import DeleteConcession from "./pages/concession/deleteconcession/DeleteConcession";

function App() {
  return (

      <Router>
             <Routes>
                {/* without Layout />*/}
                 <Route path="/signin" element={<LoginForm/>}/>
                 <Route path="/signup" element={<RegisterForm/>}/>

                 <Route path="/" element={<Layout />} />


                 {/* with Layout */}
                 <Route element={<Layout/>}>
                     <Route path="/createmovie" element={<CreateMovie/>}/>
                     <Route path="/managemovie" element={<EditMovie/>}/>
                     <Route path="/createhall" element={<CreateHall/>}/>
                     <Route path="/managehall" element={<UpdateHall/>}/>
                     <Route path="/managehall/:screenid" element={<EditHall/>}/>
                     <Route path="/createschedule/" element={<CreateSchedule/>}/>
                     <Route path="/manageschedule/" element={<ManageSchedule/>}/>
                     <Route path="/profile/" element={<Profile/>}/>
                     <Route path="/createconcession/" element={<CreateConcession/>}/>
                     <Route path="/deleteconcession/" element={<DeleteConcession/>}/>


                 </Route>
             </Routes>
      </Router>
  );
}

export default App;
