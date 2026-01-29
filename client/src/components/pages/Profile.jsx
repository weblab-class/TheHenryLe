import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { get } from "../../utilities";
import "./Profile.css";

const Profile = () => {
  const { userId, handleLogout } = useContext(UserContext);

  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!userId) return; // don't fetch if logged out

    get("/api/profile/stats").then((data) => {
      setStats(data);
    });
  }, [userId]);

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {userId ? (
        <>
          <p>Your user ID is: {userId}</p>

          {stats ? (
            <div className="profile-stats">
              <p>Total attempts: {stats.totalAttempts}</p>
              <p>Total guesses: {stats.totalGuesses}</p>
              <p>
                Average guesses:{" "}
                {stats.totalAttempts === 0 ? "N/A" : stats.averageGuesses.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="loading-text">Loading stats…</p>
          )}

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
