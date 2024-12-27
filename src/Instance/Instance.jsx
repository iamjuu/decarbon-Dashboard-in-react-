  import axios from "axios";

  const Instance = axios.create({
    baseURL: "http://localhost:7000", 
    // baseURL: "https://tkmscraps.com", 
    timeout: 20000,
  });


  export default Instance;