import { useEffect, useState } from "react";

const APIKEY = process.env.REACT_APP_GIPHY_API;

const useFetch = ({ GIF }) => {
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

export default useFetch;
