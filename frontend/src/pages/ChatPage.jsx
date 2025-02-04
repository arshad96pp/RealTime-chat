import React, { useEffect, useState, useRef } from "react";
import PageWraper from "../components/PageWraper";
import ChatPageHeader from "../components/ChatPageHeader";
import { useParams } from "react-router-dom";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { BsCursorFill } from "react-icons/bs";
import { AiOutlineDownload } from "react-icons/ai";
import PdfDownloaderCard from "../components/PdfDownloaderCard";
import ImageShowCard from "../components/ImageShowCard";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { TimeConvertor } from "../components/TimeConvertor";
import { CgSoftwareDownload } from "react-icons/cg";
import { socket } from "../api/socket";

const ChatPage = ({ userListArray, fetchData }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("usertoken")) || null
  );
  const { id } = useParams();
  const [sender, setSender] = useState(userData?._id);
  const [receiver, setReceiver] = useState(id);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [file, setFile] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    setReceiver(id);
    setSender(userData?._id);
  }, [id, userData]);

  useEffect(() => {
    socket.connect();
    socket.emit("join_room", sender); // Join sender's room
    console.log("calling");

    // Fetch previous messages when component mounts
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/auth/messages/${sender}/${receiver}`
        );
        setMessages(response.data.messages);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();

    // Listen for new messages
    socket.on("receive_message", (message) => {
      if (message.sender === receiver || message.receiver === receiver) {
        // Check if message already exists in state to avoid duplicates
        if (!messages.find((msg) => msg._id === message._id)) {
          setMessages((prevMessages) => [...prevMessages, message]);
          scrollToBottom();
        }
      }
    });

    // Update messages with IDs from the server
    socket.on("message_sent", (message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.tempId === message.tempId ? { ...msg, _id: message._id } : msg
        )
      );
    });

    return () => {
      socket.disconnect(); // Disconnect socket when component unmounts
    };
  }, [sender, receiver]);

  const sendMessage = () => {
    if (userMessage.trim() || file !== null) {
      const tempId = Date.now().toString();
      fetchData();
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        // for image upload
        axios
          .post("http://localhost:8000/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            const message = {
              tempId,
              sender,
              receiver,
              content: userMessage,
              file: response.data.filePath, // Store the file path
              fileType: file.type,
              fileName: file.name,
              fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            };

            setMessages((prevMessages) => [...prevMessages, message]); // Add the message with the temporary ID
            socket.emit("send_message", message);
            setUserMessage("");
            setFile(null); // Clear the file after sending
            setSelectedFile(null);
          })
          .catch((error) => {
            console.error("Error uploading file", error);
          });
      } else {
        const message = {
          tempId,
          sender,
          receiver,
          content: userMessage,
          file: null,
          fileType: null,
          fileName: "",
          fileSize: null,
        };
        socket.emit("send_message", message); // Emit send_message event
        setMessages((prevMessages) => [...prevMessages, message]);
        setUserMessage("");
      }
    }
  };

  useEffect(() => {
    const userDataFromLocalStorage = JSON.parse(
      localStorage.getItem("usertoken")
    );
    setUserData(userDataFromLocalStorage);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setSelectedFile(file);
  };

  const singelUser = userListArray.find((item) => item?._id === id);

  const { formatWhatsAppTimestamp } = TimeConvertor();

  const filteredMessages = messages.filter(
    (message, index, self) =>
      index === self.findIndex((m) => m._id === message._id)
  );

  return (
    <PageWraper>
      <ChatPageHeader {...singelUser} />
      <div className="chat__area">
        <div className="message_view_section">
          {filteredMessages.map((message, index) => {
            return (
              <div
                key={message._id || message.tempId}
                className={`message_${
                  message.sender === sender ? "sender" : "reciver"
                }`}
              >
                <div className="header_timeStamp">
                  <span className="timeStamp">
                    {formatWhatsAppTimestamp(message?.timestamp)}
                  </span>

                  {message.file && (
                    <a
                      href={`${message.file}`}
                      download={`file_${index}`}
                      style={{ display: "block", textAlign: "center" }}
                      className={`${
                        message.sender === sender
                          ? "download_remove"
                          : "download__icon"
                      }`}
                    >
                      <CgSoftwareDownload style={{ fontSize: "24px" }} />
                    </a>
                  )}
                </div>
                {message.file && message.fileType === "application/pdf" ? (
                  <PdfDownloaderCard
                    fileName={message.fileName}
                    fileSize={message.fileSize}
                    fileUrl={message.file}
                    index={index}
                    timeStamp={message.timestamp}
                  />
                ) : (
                  <>
                    {message?.file && (
                      <ImageShowCard
                        fileUrl={message.file}
                        index={index}
                        contition={message.sender === sender}
                        timeStamp={message.timestamp}
                      />
                    )}
                  </>
                )}
                <p>{message.content}</p>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
        <div className="message_sending_section">
          <div className="chat_input_wraper">
            <input
              type="text"
              placeholder="Type a message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
            />
            <div className="file_upload">
              <input
                type="file"
                id="fileUpload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="fileUpload">
                {selectedFile ? (
                  <CheckCircleOutlineIcon
                    style={{
                      cursor: "pointer",
                      fontSize: "26px",
                      color: "rgb(69, 69, 248)",
                    }}
                    title="File Selected"
                  />
                ) : (
                  <AttachFileIcon
                    style={{ cursor: "pointer", fontSize: "24px" }}
                    title="Attach a file"
                  />
                )}
              </label>
            </div>
            <button onClick={sendMessage}>
              <BsCursorFill style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>
      </div>
    </PageWraper>
  );
};

export default ChatPage;
