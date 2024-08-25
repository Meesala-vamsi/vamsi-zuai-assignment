import { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import "./Home.css";
import axios from "axios";
import { ReactContext } from "../../ReactContext/Context";
import cookies from "js-cookie";
import BlogList from "../BlogList/BlogList";
import { IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";

const Home = () => {
  const { url,getBlogs,fetchBlogs,setBlogs } = useContext(ReactContext);
  const [searchValue,setSearch] = useState("")

 

  useEffect(() => {
    const onChangeInput=async(e)=>{
      await axios.get(`${url}/search?search=${searchValue}`,{
        headers:{
          Authorization:`Bearer ${cookies.get("authToken")}`
        }
      })
      .then((response)=>{
        if(response.status===200){
          setBlogs(response.data.data.blog)
        }
      })
      .catch((error)=>{
        console.log(error)
        toast.error(error.message)
      })
    }
    fetchBlogs();
    onChangeInput()
  }, [fetchBlogs,url,searchValue,setBlogs]);

  return (
    <>
      <Header />
      <div className="banner">
        <div className="banner-text">Blogs</div>
      </div>

      <div className="search-container">
        <IoSearch className="search-logo"/>
        <input type="text" className="search-element" placeholder="Search blog..." onChange={(e)=>{setSearch(e.target.value)}}  />
    </div>

      <div className="blogs-main-container">
        <BlogList blogData={getBlogs} />
      </div>
    </>
  );
};

export default Home;
