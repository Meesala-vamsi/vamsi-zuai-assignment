import { Link } from "react-router-dom";
import "./BlogList.css";
import { format } from "date-fns";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { useContext, useState } from "react";
import { ReactContext } from "../../ReactContext/Context";
import axios from "axios";
import cookies from "js-cookie"
import { toast } from "react-toastify";

const BlogList = ({ blogData }) => {
  const { fetchBlogs, url } = useContext(ReactContext);
  const [showPopup, setShowPopup] = useState(false);
  const [existedBlog, setexistedBlog] = useState(null);

  const onClickEditButton = (e, blog) => {
    e.stopPropagation();
    e.preventDefault();
    setexistedBlog(blog);
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setexistedBlog({
      ...existedBlog,
      [name]: value,
    });
  };

  const handleTagsChange = (e) => {
    setexistedBlog({
      ...existedBlog,
      tags: e.target.value.split(',').map(tag => tag.trim()),
    });
  };

  const handleImageChange = (e) => {
    setexistedBlog({
      ...existedBlog,
      image: e.target.files[0], 
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

      const formData = new FormData();
      formData.append('title', existedBlog.title);
      formData.append('description', existedBlog.description);
      formData.append('timeTakeToRead', existedBlog.timeTakeToRead);
      formData.append('tags', existedBlog.tags.join(','));
      if (existedBlog.image) {
        formData.append('image', existedBlog.image);
      }

      await axios.patch(`${url}/posts/${existedBlog._id}`, formData, {
        headers: {
          Authorization: `Bearer ${cookies.get("authToken")}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response)=>{
        if(response.status===200){
          toast.success(response.data.message)
          fetchBlogs();
        setShowPopup(false);
        }
      })
  };

  const onClickDelete=async(e,id)=>{
    e.stopPropagation()
    e.preventDefault()

    await axios.delete(`${url}/posts/${id}`,{
      headers:{
        Authorization:`Bearer ${cookies.get("authToken")}`
      }
    })
    .then((response)=>{
      if(response.status===200){
        toast.success(response.data.message)
        fetchBlogs()
      }
    })
    .catch((error)=>{
      toast.error(error.response.message)
    })
  }

  return (
    <>
      <ul className="blog-list-container">
        {blogData.map((eachBlog, index) => (
          <li className="blog-list-items" key={index}>
            <Link to={`/blogs/${eachBlog._id}`} className="nav-link" key={index}>
              <div className="blog-sub-list">
                <div className="blog-image-container">
                  <img
                    src={eachBlog.image}
                    alt="blog-image"
                    className="blog-image"
                  />
                </div>
                <div className="blog-content-container">
                  <div className="blog-tags">
                    {eachBlog.tags.length > 0 && (
                      <ul className="tags-container">
                        {eachBlog.tags.map((eachTag, index) => (
                          <li className="tags-list-items" key={index}>
                            {eachTag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <h3 className="blog-title">{eachBlog.title}</h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0px",
                    }}
                  >
                    <p>{format(new Date(eachBlog.createdAt), "dd MMMM, yyyy")}</p>
                    <p>{eachBlog.timeTakeToRead}</p>
                  </div>
                  <CiEdit
                    style={{ fontSize: "20px", marginRight: "15px", cursor: "pointer" }}
                    onClick={(e) => onClickEditButton(e, eachBlog)}
                  />
                  <MdDelete style={{ fontSize: "20px", cursor: "pointer" }} onClick={(e)=>onClickDelete(e,eachBlog._id)} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Edit Blog</h2>
            <form onSubmit={handleUpdate}>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={existedBlog.title}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Description:
                <textarea
                  name="description"
                  value={existedBlog.description}
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
                />
              </label>

              <label>
                Tags (comma-separated):
                <input
                  type="text"
                  value={existedBlog.tags.join(', ')}
                  onChange={handleTagsChange}
                  required
                />
              </label>

              <label>
                Time Taken to Read:
                <input
                  type="text"
                  name="timeTakeToRead"
                  value={existedBlog.timeTakeToRead}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="popup-buttons">
                <button type="submit" className="submit-btn">
                  Update
                </button>
                <button type="button" onClick={() => setShowPopup(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;
