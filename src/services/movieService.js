import axios from "axios";
import { API_URL } from "../config";

export const getMovies = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/movies/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovie = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/movies/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};