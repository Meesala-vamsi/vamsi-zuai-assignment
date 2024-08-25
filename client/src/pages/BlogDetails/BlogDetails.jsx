import axios from "axios";
import cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactContext } from "../../ReactContext/Context";
import Header from "../../components/Header/Header";
import { toast } from "react-toastify";
import "./BlogDetails.css";
import { format } from "date-fns";

const BlogDetails = () => {
  const navigate = useNavigate()
  const [getBlogDetails, setBlogDetails] = useState({});
  const { id } = useParams();
  const { url } = useContext(ReactContext);
  const requestUrl = `${url}/posts/${id}`;
  useEffect(() => {
    const getDetails = async () => {
      await axios
        .get(requestUrl, {
          headers: {
            Authorization: `Bearer ${cookies.get("authToken")}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setBlogDetails(response.data.data.blog);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message);
        });
    };

    getDetails();
  }, [requestUrl]);
  return (
    <>
      <Header />
      <div className="blog-details-container">
        <h2 className="blog-detail-title">{getBlogDetails.title}</h2>
        <div
          style={{
            display: "flex",
            marginTop: "0px",
            gap:"20px"
          }}
        >
          <p>{getBlogDetails.createdAt && format(new Date(getBlogDetails.createdAt), "dd MMMM, yyyy")}</p>
          <p>{getBlogDetails.timeTakeToRead}</p>
        </div>
        <div>
        <div className="blog-tags">
                  {getBlogDetails.tags && (
                    <ul className="tags-container">
                      {getBlogDetails.tags.map((eachTag, index) => (
                        <li className="tags-list-items" key={index}>
                          {eachTag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
        </div>
        <img src={getBlogDetails.image} alt="blog-image" className="blog-detail-image" />
        <p>{getBlogDetails.description}</p>
        <div>
          <button onClick={()=>{navigate("/")}}>Go Back</button>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
