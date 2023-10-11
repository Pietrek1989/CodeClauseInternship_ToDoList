import { useEffect, useState } from "react";

const APIKEY = process.env.REACT_APP_GIPHY_API;

export const useFetch = ({ GIF }) => {
  console.log(APIKEY);
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${GIF.split(
          " "
        ).join("")}&limit=1`
      );
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (GIF) fetchGifs();
  }, [GIF]);

  return gifUrl;
};

export const getUserData = () => async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BE_URL}/users/me/info`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("accessToken")}`,
      },
    });

    if (res.ok) {
      const userData = await res.json();
      return userData;
    } else if (res.status === 401) {
      // access token has expired or is invalid, refresh access token
      await refreshAccessToken();
      // try to get user data again
      const newAccessToken = localStorage.getItem("accessToken");
      console.log("the updated access", newAccessToken);
      if (newAccessToken) {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
        if (response.ok) {
          const userData = await response.json();
          return userData;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("refresh in func", refreshToken);
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/users/session/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentRefreshToken: refreshToken,
      }),
    }
  );
  console.log(response.status);
  if (response.ok) {
    console.log("response", response);
    const { accessToken, refreshToken } = await response.json();
    console.log("the new refresh token", refreshToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  } else if (response.status === 401) {
    // refresh token has expired, log user out and redirect to login page
    localStorage.setItem("accessToken", "");
    localStorage.setItem("refreshToken", "");
    window.location.href = "/";
  } else {
    console.log("last error");
  }
};

export const handleLogOutDatabase = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      const response = await fetch(
        `${process.env.REACT_APP_BE_URL}/users/session`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } else {
        throw new Error("Logout failed");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const logIn = async (formValues, e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${process.env.REACT_APP_BE_URL}/users/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      window(
        `/?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`
      );
    } else {
      console.error("Error logging in:");
    }
  } catch (error) {
    console.error(error);
  }
};
