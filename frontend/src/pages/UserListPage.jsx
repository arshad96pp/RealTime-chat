import React from "react";
import UserListHeader from "../components/UserListHeader";
import UserCardList from "../components/UserCardList";

const UserListPage = ({ userListArray }) => {
  console.log("mess", userListArray);

  return (
    <>
      <UserListHeader />
      <div className="user_list_conytainer">
        {userListArray.length === 0
          ? ""
          : userListArray.map((item, index) => (
              <UserCardList key={index} {...item} />
            ))}
      </div>
    </>
  );
};

export default UserListPage;
