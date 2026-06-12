import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/movies/";

export const getMovies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovie = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};