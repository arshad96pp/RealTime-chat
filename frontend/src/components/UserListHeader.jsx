import { Avatar } from "@mui/material";
import React from "react";

const UserListHeader = () => {
  const handelLogout=()=>{
    localStorage.removeItem('usertoken')
    window.location.reload()
  }
  return (
    <header className="user_list_header">
      <div>
        <h1 className="">Chat</h1>
      </div>
      <div onClick={()=>handelLogout()}>
        <Avatar  sx={{ width: 25, height: 25 }}></Avatar>
      </div>
    </header>
  );
};

export default UserListHeader;
