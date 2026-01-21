import { useContext } from "react";
import { UserContext } from "../App";

const Profile = () => {
  const { userId } = useContext(UserContext);

  return (
    <div>
      <h1>profile</h1>
      {userId ? (
        <>
          <p>Your user ID is: {userID}</p>
          <buttton onClick={handleLogout}>Logout</buttton>
        </>
      ) : (
        <p> You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
