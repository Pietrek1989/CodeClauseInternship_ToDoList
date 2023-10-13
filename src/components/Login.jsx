/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";
import React, { useState } from "react";
import "../google.css";
import { logIn, register } from "./useFetch";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";

const LoginPage = ({ formMode, setFormMode, fetchUserData, handleClose }) => {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    username: formMode === "register" ? "" : undefined,
  });
  const [isLoading, setisLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_BE_URL;

  const toggleFormMode = () => {
    setFormMode((prevMode) => (prevMode === "login" ? "register" : "login"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("trying to submit");

    setisLoading(true);
    let result;
    if (formMode === "login") {
      result = await logIn(formValues, e);
      toast.success("Logged in succesfully!");
    } else {
      result = await register(formValues, e);
      toast.success("Account created, please log in");
    }
    setisLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      console.log(result.data);
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      fetchUserData();
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
                  setFormValues({ ...formValues, password: e.target.value })
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
          </form>
          {/* {isLoading && (
        <Spinner
        as="span"
        animation="grow"
        size="sm"
        role="status"
        aria-hidden="true"
      />
          )} */}
          <p className="text-center mt-2 fs-5 text-secondary">OR</p>{" "}
          <a href={`${apiUrl}/users/googlelogin`} className="a-google">
            <button className="button-google mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 262"
                className="svg"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  className="blue"
                ></path>
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  className="green"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  className="yellow"
                ></path>
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  className="red"
                ></path>
              </svg>
              <span className="text">Continue with Google</span>
            </button>
          </a>
          <p className="mt-3">
            {formMode === "login" ? (
              <>
                Need an account?{" "}
                <a
                  className="icon-link icon-link-hover"
                  href="#"
                  onClick={toggleFormMode}
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
                  onClick={toggleFormMode}
                >
                  Log in
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
