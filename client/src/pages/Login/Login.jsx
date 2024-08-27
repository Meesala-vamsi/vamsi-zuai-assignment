import axios from 'axios';
import "./Login.css";
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import { toast } from "react-toastify"
import { ReactContext } from '../../ReactContext/Context';

const Login = () => {
  const [details, setDetails] = useState({
    email: '',
    password: ''
  });
  const { url } = useContext(ReactContext);
  const navigate = useNavigate();

  const onChangeInput = (e) => {
    const { id, value } = e.target;
    setDetails({
      ...details,
      [id]: value
    });
  };

  const onSubmitSuccess = (data) => {
    cookies.set('authToken', data.token, { expires: 30});
    localStorage.setItem("userData",JSON.stringify(data.data))
    navigate('/');
  };

  const onSubmitDetails = async (e) => {
    e.preventDefault();

    await axios.post(`${url}/auth/login`, details)
      .then((response) => {
        if (response.status === 200) {
          toast.success(response.data.message)
          onSubmitSuccess(response.data);
        }
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message)
      });
    setDetails({
      email: '',
      password: ''
    });
  };

  const onClickCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className='login-container'>
      <h1>Login</h1>
      <form onSubmit={onSubmitDetails} className='form-container'>
        <div className='input-container'>
          <label htmlFor='email'>Email</label>
          <input type='text' id='email' value={details.email} placeholder='Email' onChange={onChangeInput} />
        </div>
        <div className='input-container'>
          <label htmlFor='password'>Password</label>
          <input type='password' id='password' placeholder='Password' value={details.password} onChange={onChangeInput} />
        </div>
        <div className='btn1-container'>
          <button type='submit'>Submit</button>
          <div className='account-link-container'>
            <p>Don't have an Account? </p>
            <p onClick={onClickCreateAccount} className='account-link'>Create An Account</p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
