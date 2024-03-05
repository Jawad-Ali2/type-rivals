import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useFetch = (url) => {
  const [paragraph, setParagraph] = useState("");
  const [audioLink, setAudioLink] = useState(null);
  const [errors, setErrors] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const { isAuthenticated, token } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log(paragraph, audioLink, errors, refetch);
  }, []);

  const resetData = () => {
    console.log("HJDKGHSG");
    setErrors((prev) => null);
    setParagraph((prev) => "");
    setAudioLink((prev) => null);
    setRefetch((prev) => !prev);
  };
  useEffect(() => {
    console.log("Fetching data...", isAuthenticated, token, refetch);
    if (!isAuthenticated) {
      navigate("/auth");
    }
    const controller = new AbortController();
    const signal = controller.signal;
    const options = {
      headers: {
        Authorization: "Bearer " + token,
      },
      signal,
    };

    async function startFetching() {
      try {
        const response = await axios.get(url, options);

        if (response.status === 200) {
          const data = await response.data;
          setParagraph((prev) => data.content.text);
          setAudioLink((prev) => data.url[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    startFetching();
    return () => {
      controller.abort();
    };
  }, [isAuthenticated, token, refetch]);

  return [paragraph, audioLink, errors, resetData];
};
