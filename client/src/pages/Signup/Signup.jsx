import axios from "axios"
import "./Signup.css"
import { useContext, useState } from "react"
import { ReactContext } from "../../ReactContext/Context"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Signup = () => {
  const [details, setDetails] = useState({
    username: "",
    email: "",
    password: ""
  })

  const { url } = useContext(ReactContext)
  const navigate = useNavigate()

  const onChangeInput = (e) => {
    const { id, value } = e.target
    setDetails({
      ...details,
      [id]: value
    });
  }


  const onClickLogin = () => {
    navigate("/login")
  }

  const onSubmitDetails = async (e) => {
    e.preventDefault()

    await axios.post(`${url}/auth/register`, details)
      .then(response => {
        if (response.data.status === 200 || 201) {
          navigate("/login")
          toast.success(response.data.message)
        }
      }).catch(err => {
        console.log(err)
        toast.error(err.response.data.message)
      })
    setDetails({
      email: "",
      password: "",
      username: ""
    })
  }


  return (
    <div className="signup-container">
      <h1>SignUp</h1>
      <form action="" onSubmit={onSubmitDetails} className="form-container">
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={details.username} placeholder="Username" onChange={onChangeInput} />
        </div>
        <div className="input-container">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={details.email} placeholder="Email" onChange={onChangeInput} />
        </div>
        <div className="input-container">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Password" value={details.password} onChange={onChangeInput} />
        </div>
        <div className="btn1-container">
          <button type="submit">Submit</button>
          <div className="account-link-container">
            <p>Already have an account?</p>
            <p onClick={onClickLogin} className="account-link">Go to Login</p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Signup