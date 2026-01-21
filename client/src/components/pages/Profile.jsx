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
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p> You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
