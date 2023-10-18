import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getUserData, handleLogOutDatabase } from "./useFetch";
import LoginPage from "./Login";
import UserSettingsModal from "./UserSettingsModal";
import { useNavigate } from "react-router-dom";

const NavBar = ({ fetchTasks, setTasks }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const [formMode, setFormMode] = useState("login");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const handleShowLogin = () => setShowLoginModal(true);
  const handleCloseLogin = () => setShowLoginModal(false);
  const handleShowUserSettings = () => setShowUserSettingsModal(true);

  const handleCloseUserSettings = () => {
    setShowUserSettingsModal(false);
  };
  const handleLogout = () => {
    handleLogOutDatabase();
    setIsLogged(false);
    setUserData(null);
    setTasks({ todo: [], doing: [], done: [] });

    handleCloseUserSettings();
  };
  const fetchUserData = async () => {
    const data = await getUserData();
    if (data) {
      setUserData(data);
      setIsLogged(true);
      console.log("data user", data);
    }
  };
  useEffect(() => {
    // Check URL parameters for tokens
    const urlParams = new URLSearchParams(window.location.search);
    const urlAccessToken = urlParams.get("accessToken");
    const urlRefreshToken = urlParams.get("refreshToken");

    if (urlAccessToken && urlRefreshToken) {
      // If tokens are found in URL parameters, save them to local storage
      localStorage.setItem("accessToken", urlAccessToken);
      localStorage.setItem("refreshToken", urlRefreshToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchUserData();
    } else {
      // If tokens are not found in URL parameters, check local storage
      const localAccessToken = localStorage.getItem("accessToken");
      const localRefreshToken = localStorage.getItem("refreshToken");
      if (localAccessToken && localRefreshToken) {
        fetchUserData();
      }
    }
  }, []);

  return (
    <nav className="mb-2">
      <img
        src="/to-do-list-high-resolution-logo-color-on-transparent-background.png"
        alt="logo to do list"
        className="mx-auto mt-1 d-flex flex-center logo"
        onClick={() => navigate("/")}
        style={{ width: "200px" }}
      />
      <div className="position-absolute top-0 end-0 m-1 container-modal-open-button ">
        {isLogged ? (
          <div onClick={handleShowUserSettings} style={{ cursor: "pointer" }}>
            <span className="fw-bold name">Hello {userData?.username}</span>
            <img
              src={userData?.avatar}
              alt={`${userData?.username}'s avatar`}
              className=" avatar ms-2"
            />
          </div>
        ) : (
          <button
            className="modal-open-button fw-bold"
            onClick={handleShowLogin}
          >
            LOG IN
          </button>
        )}
        <Modal show={showLoginModal} onHide={handleCloseLogin}>
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {formMode === "login"
                ? "Log in to your account"
                : "Create an account"}
            </Modal.Title>
          </Modal.Header>

          <LoginPage
            handleClose={handleCloseLogin}
            formMode={formMode}
            setFormMode={setFormMode}
            fetchUserData={fetchUserData}
            fetchTasks={fetchTasks}
          />
        </Modal>
        <UserSettingsModal
          show={showUserSettingsModal}
          handleClose={handleCloseUserSettings}
          handleLogout={handleLogout}
          fetchUserData={fetchUserData}
          userData={userData}
        />
      </div>
    </nav>
  );
};

export default NavBar;
