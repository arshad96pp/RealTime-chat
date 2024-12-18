import React, { useEffect, useState } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import PageWraper from "../components/PageWraper";
import UserListPage from "./UserListPage";
import ChatPage from "./ChatPage";
import { getAllUsers } from "../api/api";

const Main = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("usertoken")) || null
  );
  const [userListArray, setUserListArray] = useState([]);

  const [onlineUsers, setOnlineUsers] = useState({});

  // const socket = io("http://localhost:8000");
  const currentUserId = userData?._id;
  const fetchData = async () => {
    try {
      const response = await getAllUsers();
      setUserListArray(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  const filteredUsers = userListArray.filter(
    (user) => user?._id !== currentUserId
  );

  return (
    <div className="app__layout">
      <Routes>
        <Route
          path="/"
          element={
            <PageWraper>
              <UserListPage userListArray={filteredUsers} />
            </PageWraper>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <PageWraper>
              <ChatPage userListArray={filteredUsers} fetchData={fetchData} />
            </PageWraper>
          }
        />
      </Routes>
    </div>
  );
};

export default Main;
