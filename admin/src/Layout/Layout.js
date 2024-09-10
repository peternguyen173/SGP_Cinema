import Sidebar from "../components/Navbar/Sidebar";
import "./Layout.css"
import {Outlet} from "react-router";

const Layout = () =>{
    return( <>
    <Sidebar/>
            <div className="content-container">
                <Outlet /> {/* This will render the child routes like CreateMovie */}
            </div>

    </>)
}
export default Layout;