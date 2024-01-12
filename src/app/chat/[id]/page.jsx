import React, { useState } from "react";
import ChatInput from "../../../components/chat/ChatInput";
import ChatPage from "../../../components/chat/ChatPage";
import { useSelector } from "react-redux";

const Chat = ({ params: { id } }) => {
  const [listening, setListening] = useState(false);
  const [session, initSession] =  useState(false);
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <ChatPage setListening={setListening} initSession={initSession} chatId={id} />
      {
        session && <ChatInput listening={listening} />
      }
    </div>
  );
};

export default Chat;
