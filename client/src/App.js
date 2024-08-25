import { ToastContainer } from 'react-toastify';
import './App.css';
import ContextProvider from './ReactContext/Context';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import BlogDetails from './pages/BlogDetails/BlogDetails';

const App =()=>{
  return (
    <div className="App">
      <ToastContainer/>
      <ContextProvider>
      <Routes>
      <Route element={<ProtectedRoute isAuthRoute={true} />}>
        <Route path="/login" element={<Login/>}/>
        <Route path='/register' element={<Signup/>} />
        </Route>
        <Route element={<ProtectedRoute isAuthRoute={false} />} >
        <Route path="/" element={<Home/>}/>
        <Route path='/blogs/:id' element={<BlogDetails/>} />
        </Route>
      </Routes>
      </ContextProvider>
    </div>
  );
}

export default App;
