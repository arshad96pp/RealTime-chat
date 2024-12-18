import { Download } from "@mui/icons-material";
import React from "react";

const PdfDownloaderCard = ({
  index,
  fileName,
  fileSize,
  fileUrl,
  timeStamp,
}) => {

  return (
    <div className="message_file">
      <div class="file-card">
        <div class="file-info">
          <h2>{fileName}</h2>
          <p>{fileSize}</p>
        </div>
        <div class="download-button">
          <a download={`file_${index}`} href={`${fileUrl}`}>
            <Download />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PdfDownloaderCard;
