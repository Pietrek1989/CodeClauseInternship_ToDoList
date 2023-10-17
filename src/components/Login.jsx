/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";
import React, { useState } from "react";
import "../google.css";
import { forgotPassword, logIn, register } from "./useFetch";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
import GoogleButton from "./GoogleButton";

const LoginPage = ({
  formMode,
  setFormMode,
  fetchUserData,
  handleClose,
  fetchTasks,
}) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    username: formMode === "register" ? "" : undefined,
  });
  const [isLoading, setisLoading] = useState(false);

  const toggleFormMode = (newMode) => {
    setFormMode(newMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setisLoading(true);
    let result;
    if (formMode === "login") {
      result = await logIn(formValues, e);
      toast.success("Logged in successfully!");
    } else if (formMode === "register") {
      result = await register(formValues, e);
      toast.success("Account created, please log in");
    } else if (formMode === "forgot") {
      // Call your API endpoint to handle forgotten passwords
      result = await forgotPassword(formValues.email, e);
    }
    setisLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      fetchUserData();
      fetchTasks();
      handleClose();
    }
  };
  return (
    <section className="flex flex-col md:flex-row  items-center p-5">
      <div className=" w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100 form">
          <form
            className="mt-6 "
            action="#"
            method="POST"
            onSubmit={handleSubmit}
          >
            {formMode === "register" && (
              <div className="d-flex justify-content-between align-items-center">
                <label className="block fs-5">Username:</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Enter Username"
                  className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
                  required
                  value={formValues.username}
                  onChange={(e) =>
                    setFormValues({ ...formValues, username: e.target.value })
                  }
                />
              </div>
            )}
            {formMode !== "forgot" && (
              <>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <label className="block fs-5">Email:</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter Email Address"
                    className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
                    required
                    value={formValues.email}
                    onChange={(e) =>
                      setFormValues({ ...formValues, email: e.target.value })
                    }
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2">
                  <label className="block  fs-5">Password:</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter Password"
                    minLength={5}
                    className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
                    required
                    value={formValues.password}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        password: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className="  rounded   w-24  submit-button "
                  >
                    {" "}
                    {isLoading && (
                      <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    {formMode === "login" ? "Log In" : "Register"}
                  </button>
                </div>
              </>
            )}

            {formMode === "forgot" && (
              <div className="d-flex justify-content-between align-items-center mt-2">
                <label className="block fs-5">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email Address"
                  className="w-full p-2 rounded-lg mt-2 border rounded-2 focus:border-blue-500 flex focus-ring"
                  required
                  value={formValues.email}
                  onChange={(e) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                />
              </div>
            )}
            {formMode === "forgot" && (
              <div className="text-center mt-4">
                <button
                  type="submit"
                  className="  rounded   w-24  submit-button "
                >
                  Send Reset Link
                </button>
              </div>
            )}
          </form>
          {formMode !== "forgot" && (
            <>
              <p className="text-center mt-2 fs-5 text-secondary">OR</p>
              <GoogleButton />
            </>
          )}
          <p className="mt-3">
            {formMode !== "forgot" ? (
              <>
                {formMode === "login" ? (
                  <>
                    Need an account?{" "}
                    <a
                      className="icon-link icon-link-hover"
                      href="#"
                      onClick={() => toggleFormMode("register")}
                    >
                      Create an account
                    </a>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <a
                      className="icon-link icon-link-hover"
                      href="#"
                      onClick={() => toggleFormMode("login")}
                    >
                      Log in
                    </a>
                  </>
                )}
              </>
            ) : (
              <a
                className="icon-link icon-link-hover"
                href="#"
                onClick={() => toggleFormMode("login")}
              >
                Back to Login
              </a>
            )}
          </p>
          <p className="mt-3">
            {formMode !== "forgot" && (
              <a
                className="icon-link icon-link-hover"
                href="#"
                onClick={() => toggleFormMode("forgot")}
              >
                Forgot your password?
              </a>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
