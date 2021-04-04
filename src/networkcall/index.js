import axios from "axios";
import config from "../config";

const NetworkCall = axios.create({
  baseURL: config.api_url,
});

export default NetworkCall;
