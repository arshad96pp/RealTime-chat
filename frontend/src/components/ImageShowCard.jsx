import React from "react";
import { AiOutlineDownload } from "react-icons/ai";

const ImageShowCard = ({ fileUrl, index, contition, timeStamp }) => {

  return (
    <div className="message_file">
      <img
        src={`${fileUrl}`}
        alt={`file_${index}`}
        style={{ maxWidth: "100%", marginBottom: "10px" }}
      />
      
    </div>
  );
};

export default ImageShowCard;
