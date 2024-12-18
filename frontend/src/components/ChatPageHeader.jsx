import { Avatar } from "@mui/material";
import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useNavigate } from "react-router-dom";

const ChatPageHeader = ({ username, online }) => {
  const navigate = useNavigate();
  const handelClose = () => {
    navigate("/");
  };
  return (
    <div className="chat_header">
      <div className="user__card__left">
        <div className="avatar_section">
          <Avatar sx={{ width: 30, height: 30 }}></Avatar>
          {online && <div className="active" />}
        </div>
        <div className="name_details">
          <h1>{username}</h1>
          <p>Hell</p>
        </div>
      </div>
      <div className="user__card__right">
        <span onClick={() => handelClose()}>
          <CloseRoundedIcon />
        </span>
      </div>
    </div>
  );
};

export default ChatPageHeader;
