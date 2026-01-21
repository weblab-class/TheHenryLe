import { Link } from "react-router-dom";
import { UserContext } from "./App";
import { useContext } from "react";
import "./Navbar.css";

const NavBar = () => {
  const { userId, handleLogout } = useContext(UserContext);

  return (
    <nav className="navbar">
      {userId && (
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      )}

      <div className="navbar-title-bold">Timdle</div>
      <Link to="/infinitemode">Infinite Mode </Link>
      <Link to="/profile">Profile </Link>
    </nav>
  );
};

export default NavBar;
