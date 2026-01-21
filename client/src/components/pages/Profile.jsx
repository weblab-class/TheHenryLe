import { useContext } from "react";
import { UserContext } from "../App";

const Profile = () => {
  const { userId, handleLogout } = useContext(UserContext);

  return (
    <div>
      <h1>profile</h1>
      {userId ? (
        <>
          <p>Your user ID is: {userId}</p>
          <p>Add average score statistic later</p>
          <p>Maybe add a graph guesses plotted against nth game</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p> You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
