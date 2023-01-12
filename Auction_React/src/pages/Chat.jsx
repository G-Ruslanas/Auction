import React from "react";
import Message from "../components/Message";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Conversation from "../components/Conversation";
import UsersOnline from "../components/UsersOnline";
import "./css/Chat.css";

const Chat = ({ user, socket, usersOnline }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    socket.on("getMessage", (senderId, text) => {
      setArrivalMessage({
        sender: senderId,
        text: text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    usersOnline = [];
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/conversation/" + user._id
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
          const res = await axios.get(
            "http://localhost:5000/message/" + currentChat._id
          );
          setMessages(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("http://localhost:5000/message", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <span className="chatMenuInput">Your conversations</span>
          {conversations.map((c, index) => (
            <div onClick={() => setCurrentChat(c)} key={index}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          {currentChat ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m, index) => (
                  <div ref={scrollRef} key={index}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBot">
                <textarea
                  placeholder="Write something..."
                  className="chatMessageInput"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <button className="chatSubmitButton" onClick={handleSubmit}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat
            </span>
          )}
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper">
          <UsersOnline
            usersOnline={usersOnline}
            currentId={user._id}
            setCurrentChat={setCurrentChat}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
