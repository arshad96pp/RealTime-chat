import React, { useState } from "react";
import { signupData } from "../api/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [signupValue, setSignupValue] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handelChange = (e) => {
    const { name, value } = e.target;

    setSignupValue((prev) => ({ ...prev, [name]: value }));
  };

  const handelRegister = async () => {
    try {
      const response = await signupData(signupValue);
      const newResponse = await response.data;
      if (newResponse.status) {
        message.success(newResponse.message);
        navigate("/");
      } else {
        message.error(newResponse.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register_container">
      <div className="register_card">
        <div className="input_wraper">
          {/* <input type="file" name="image" onChange={(e) => handelChange(e)} /> */}
          <input
            type="email"
            value={signupValue.email}
            name="email"
            onChange={(e) => handelChange(e)}
            placeholder="email"
          />
          <input
            type="text"
            value={signupValue.username}
            name="username"
            onChange={(e) => handelChange(e)}
            placeholder="username"
          />
          <input
            type="text"
            value={signupValue.password}
            name="password"
            onChange={(e) => handelChange(e)}
            placeholder="password"
          />

          <div>
            <button onClick={handelRegister}>Signup</button>
          </div>
        </div>
      </div>
      <button onClick={() => navigate("/")}>Login</button>
    </div>
  );
};

export default Signup;
