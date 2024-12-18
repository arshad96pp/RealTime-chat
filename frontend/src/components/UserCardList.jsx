import React from "react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TimeConvertor } from "./TimeConvertor";

const UserCardList = ({ _id, username, email, createdAt,online,lastMessage}) => {
  const navigate = useNavigate();
  const handelClickUser = (_id) => {
    navigate(`/chat/${_id}`);
  };

  const { formatWhatsAppTimestamp } = TimeConvertor();

  const dataItem = formatWhatsAppTimestamp(createdAt);

  return (
    <div className="user__card" onClick={() => handelClickUser(_id)}>
      <div className="user__card__left">
        <div className="avatar_section">
          <Avatar>N</Avatar>
          {online &&  <div className="active" />  }
        </div>
        <div className="name_details">
          <h1>{username}</h1>
          <p>{lastMessage}</p>
        </div>
      </div>
      <div className="user__card__right">
        <p>{dataItem}</p>
      </div>
    </div>
  );
};

export default UserCardList;
