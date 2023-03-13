import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home'
import { BrowserRouter,
  Routes,
  Route, 
} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Search from "./components/Search";

import CreatePost from './components/CreatePost';
// import Comment from './components/Comment';
import Myprofile from './components/Myprofile';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="myprofile" element = {<Myprofile />} />
      <Route path="createpost" element = {<CreatePost />} />
      
      <Route path="search" element = {<Search />} />
    </Routes>
  </BrowserRouter>
  );