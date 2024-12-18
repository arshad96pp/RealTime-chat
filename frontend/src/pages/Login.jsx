import React, { useState } from "react";
import { loginData } from "../api/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [signupValue, setSignupValue] = useState({
    email: "",
    password: "",
  });

  const handelChange = (e) => {
    const { name, value } = e.target;

    setSignupValue((prev) => ({ ...prev, [name]: value }));
  };

  const handelRegister = async () => {
    try {
      const response = await loginData(signupValue);
      const newResponse = await response.data;
      if (newResponse.status) {
        message.success(newResponse.message);
        localStorage.setItem('usertoken',JSON.stringify(newResponse.data))
        window.location.reload()
      } else {
        message.error(newResponse.message);
      }

    } catch (error) {
      console.log(error);
    }
  };


  const navigate=useNavigate()
  return (
    <div className="register_container">
      <div className="register_card">
        <div className="input_wraper">
          <input
            type="email"
            value={signupValue.email}
            name="email"
            onChange={(e) => handelChange(e)}
            placeholder="email"

          />
          <input
            type="text"
            value={signupValue.password}
            name="password"
            onChange={(e) => handelChange(e)}
            placeholder="password"

          />

          <div>
            <button onClick={handelRegister}>Login</button>
          </div>
        </div>
      </div>
      <button onClick={()=>navigate('/signup')}>Signup</button>
    </div>
  );
};

export default Login;
