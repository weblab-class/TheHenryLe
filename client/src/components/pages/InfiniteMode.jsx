import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";
import { UserContext } from "../App";
import { Link } from "react-router-dom";

const InfiniteMode = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      {userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )}

      <div>
        {" "}
        <Link to="/profile">Go to Profile</Link>
      </div>
      <div>
        {" "}
        <Link to="/infinitemode">Go to the Infinite</Link>
      </div>
      <h1>Welcome to the Infinite!</h1>
    </>
  );
};

export default InfiniteMode;
