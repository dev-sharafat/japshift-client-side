import axios from "axios";

const axiosInstent = axios.create({
  baseURL: `http://localhost:5000`,
});
const useAxiosInstant = () => {
  return axiosInstent;
};
export default useAxiosInstant;
