import { useEffect, useState } from "react";

const APIKEY = process.env.REACT_APP_GIPHY_API;

export const useFetch = ({ GIF }) => {
  const [gifUrl, setGifUrl] = useState("");

  const fetchGifs = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${encodeURIComponent(
          GIF
        )}&limit=1`
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

export const getUserData = async () => {
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
      // console.log("the updated access", newAccessToken);
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

export const taskRequests = async (method, endpoint, body) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: body && JSON.stringify(body),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return await response.json();
      } else {
        console.warn("Unexpected content type:", contentType);
        throw new Error(`Unexpected content type: ${contentType}`);
      }
    } else if (response.status === 401) {
      // access token has expired or is invalid, refresh access token
      await refreshAccessToken();
      // try to get user data again
      const newAccessToken = localStorage.getItem("accessToken");
      // console.log("the updated access", newAccessToken);
      if (newAccessToken) {
        const response = await fetch(
          `${process.env.REACT_APP_BE_URL}${endpoint}`,
          {
            method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: body && JSON.stringify(body),
          }
        );
        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.error(`Failed to ${method} data:`, errorText);
      throw new Error(`Server error: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error during ${method} request:`, error);
    return { error: error.message };
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  // console.log("refresh in func", refreshToken);
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
  // console.log(response.status);
  if (response.ok) {
    // console.log("response", response);
    const { accessToken, refreshToken } = await response.json();
    // console.log("the new refresh token", refreshToken);
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
    // console.log("Access Token:", accessToken);

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
    } else {
      console.error("Invalid or missing tokens");
    }
  } catch (error) {
    console.error(error);
  }
};

export const logIn = async (formValues, e) => {
  e.preventDefault();
  const result = { data: null, error: null };
  try {
    const res = await fetch(`${process.env.REACT_APP_BE_URL}/users/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    if (res.ok) {
      result.data = await res.json();
    } else {
      const errorData = await res.json();
      result.error = errorData.message || "An error occurred";
    }
  } catch (error) {
    console.error(error);
    result.error = "An error occurred";
  }
  return result;
};

export const register = async (formValues) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/users/account`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to register" };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error("Error registering user:", error);
    return { error: error.message || "An error occurred while registering" };
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/email/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || "Error requesting password reset" };
    }
    return { data };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { error: error.message || "Error requesting password reset" };
  }
};

export const resetPassword = async (newPassword, token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BE_URL}/email/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return { error: data.message || "Error resetting password" };
    }
    return { data };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: error.message || "Error resetting password" };
  }
};
