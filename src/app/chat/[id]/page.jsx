import React, { useState } from "react";
import ChatInput from "../../../components/chat/ChatInput";
import ChatPage from "../../../components/chat/ChatPage";
import { useSelector } from "react-redux";

const Chat = ({ params: { id } }) => {
  const [listening, setListening] = useState(false);
  const [submittingAsl, setSubmittingAslFunc] = useState(false);
  const [session, initSession] =  useState(false);
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <ChatPage submittingAsl={submittingAsl} setListening={setListening} initSession={initSession} chatId={id} />
      {
        session && <ChatInput listening={listening} submittingAsl={submittingAsl} setSubmittingAslFunc={setSubmittingAslFunc} />
      }
    </div>
  );
};

export default Chat;
