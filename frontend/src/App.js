import React, { useEffect, useState } from "react";
import Main from "./pages/Main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const App = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("usertoken") || null)
  );
  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(
      localStorage.getItem("usertoken")
    );
    setUserData(userDataFromLocalStorage);
  }, []);

  return (
    <>
      <BrowserRouter>
        {userData?.token ? (
          <>
            <Main />
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </>
        )}
        {/* <Main /> */}
      </BrowserRouter>
    </>
  );
};

export default App;
