import "./App.css";

import SideBar from "./component/SideBar/SideBar";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./component/DashBoard/DashBoard";
import History from "./component/History/History";
import Admin from "./component/Admin/Admin";
import Login from "./component/login/Login";

import { useContext } from "react";
import { AuthContext } from "./component/utils/HOC/AuthContext";

function App() {
  const { isLogin } = useContext(AuthContext);

  return (
    <div className='App'>
      {isLogin && <SideBar />}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/history' element={<History />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App