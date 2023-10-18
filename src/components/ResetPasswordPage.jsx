// ResetPasswordPage.js
import React, { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "./useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import NavBar from "./Nav";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);

    const result = await resetPassword(newPassword, token);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Password reset successful");
      setTimeout(() => navigate("/"), 1000);
    }
    setisLoading(false);
  };

  return (
    <>
      <NavBar />
      <section className="flex items-center justify-center p-5 my-auto">
        <div className="form d-flex flex-column align-items-center justify-content-center">
          {/* <img
          src="/to-do-list-high-resolution-logo-color-on-transparent-background.png"
          alt="logo to do list"
          className="mx-auto mt-1 d-flex flex-center logo"
          style={{ width: "200px" }}
          onClick={() => navigate("/")}
        /> */}
          <form action="#" method="POST" onSubmit={handleSubmit}>
            <div className="mt-2 d-flex flex-column justify-center">
              <label className="text-center fs-2 fw-bold ">New Password:</label>
              <input
                type="password"
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="text-center mt-4">
              <button
                type="submit"
                className="add-task-button text-white rounded p-2"
              >
                {isLoading && (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ResetPasswordPage;
