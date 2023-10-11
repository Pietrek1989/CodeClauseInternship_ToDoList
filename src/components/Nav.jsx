import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap components
import { getUserData, handleLogOutDatabase } from "./useFetch";
import LoginPage from "./Login"; // Import your LoginPage component
import UserSettingsModal from "./UserSettingsModal"; // Import UserSettingsModal component

const NavBar = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);

  const handleShowLogin = () => setShowLoginModal(true);
  const handleCloseLogin = () => setShowLoginModal(false);
  const handleShowUserSettings = () => setShowUserSettingsModal(true);
  const handleCloseUserSettings = () => setShowUserSettingsModal(false);

  const handleLogout = () => {
    handleLogOutDatabase();

    setIsLogged(false);
    setUserData(null);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");
    console.log(refreshToken, accessToken);
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      setUserData(getUserData);
      setIsLogged(true);
    }
  }, [accessToken, refreshToken]);

  return (
    <nav>
      <img
        src="/to-do-list-high-resolution-logo-color-on-transparent-background.png"
        alt="logo to do list"
        className="mx-auto mt-1 d-flex flex-center"
        style={{ width: "200px" }}
      />
      <div className="position-absolute top-0 end-0 m-2 ">
        {isLogged ? (
          <div onClick={handleShowUserSettings} style={{ cursor: "pointer" }}>
            <span>Hi {userData?.username}</span>
            <img src={userData?.image} alt={`${userData?.username}'s avatar`} />
          </div>
        ) : (
          <Button variant="primary" onClick={handleShowLogin}>
            Login
          </Button>
        )}
        <Modal show={showLoginModal} onHide={handleCloseLogin}>
          <LoginPage handleClose={handleCloseLogin} />
        </Modal>
        <UserSettingsModal
          show={showUserSettingsModal}
          handleClose={handleCloseUserSettings}
          handleLogout={handleLogout}
        />
      </div>
    </nav>
  );
};

export default NavBar;
