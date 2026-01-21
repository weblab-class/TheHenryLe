import { GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import { useContext } from "react";
import "./NavBar.css";

const NavBar = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  return (
    <nav className="navbar">
      <div className="navbar-title-bold">Timdle </div>
      <Link to="/infinitemode">Infinite Mode </Link>
      <Link to="/profile">Profile </Link>

      <div className="logout-btn">
        {userId ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <GoogleLogin onSuccess={handleLogin} />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
