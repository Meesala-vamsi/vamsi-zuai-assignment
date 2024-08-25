import cookies from "js-cookie"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';
import "./Header.css";
import { useContext, useState } from "react";
import axios from "axios"
import {ReactContext} from "../../ReactContext/Context"

const Header = () => {
  const navigate= useNavigate()
  const {url,fetchBlogs} = useContext(ReactContext)

  const [showPopup, setShowPopup] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    description: '',
    image: null,
    tags: [],
    timeTakeToRead: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData({
      ...blogData,
      [name]: value,
    });
  };

  const handleTagsChange = (e) => {
    setBlogData({
      ...blogData,
      tags: e.target.value.split(',').map(tag => tag.trim()),
    });
  };
  const onClickLogout = ()=>{
    cookies.remove("authToken")
      toast.success("Logout successfully..")
      localStorage.removeItem("userData")
      navigate("/login")
  }

  const handleImageChange = (e) => {
    setBlogData({
      ...blogData,
      image: e.target.files[0], 
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  formData.append('title', blogData.title);
  formData.append('description', blogData.description);
  formData.append('image', blogData.image); 
  formData.append('tags', blogData.tags);
  formData.append('timeTakeToRead', blogData.timeTakeToRead);
    try {
      const response = await axios.post(`${url}/posts`, formData, {
        headers: {
          'Authorization': `Bearer ${cookies.get("authToken")}`,
          'Content-Type': 'multipart/form-data', 
        },
      }
      
    )
    if(response.status===201){
      fetchBlogs()
    }
      
      setShowPopup(false);
      toast.success('Blog created successfully!');
    }catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog.');
    }
  };

  return (
    <nav className="header">
      <div className="logo">
        <h4>ZuAi</h4>
      </div>
      <div className="btn-container">
      
      <button className="create-blog" style={{marginRight:"20px"}} onClick={() => setShowPopup(true)}>Create blog +</button>
      <button className="create-blog" onClick={onClickLogout}>Logout</button>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <form onSubmit={handleSubmit}>
              <h2>Create a New Blog</h2>

              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  value={blogData.description}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Image:
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  required
                />
              </label>

              <label>
                Tags (comma-separated):
                <input
                  type="text"
                  value={blogData.tags.join(', ')}
                  onChange={handleTagsChange}
                  required
                />
              </label>

              <label>
                Time Taken to Read:
                <input
                  type="text"
                  name="timeTakeToRead"
                  value={blogData.timeTakeToRead}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="popup-buttons">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button type="button" onClick={() => setShowPopup(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
