import axios from "axios";
import React, { useCallback, useState } from "react";
import cookies from "js-cookie"

export const ReactContext = React.createContext()

const ContextProvider = ({children})=>{
  const url = "https://vamsi-zuai-assignment.onrender.com"
  const [getBlogs, setBlogs] = useState([]);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/posts`, {
        headers: {
          Authorization: `Bearer ${cookies.get("authToken")}`,
        },
      });
      if (response.status === 200) {
        setBlogs(response.data.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  },[url]);

  return(
    <ReactContext.Provider value={{url,getBlogs,fetchBlogs, setBlogs}}>
      {children}
    </ReactContext.Provider>
  )
}

export default ContextProvider