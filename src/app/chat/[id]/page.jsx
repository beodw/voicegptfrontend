import { useState } from "react";
import ChatInput from "../../../components/chat/ChatInput";
import ChatPage from "../../../components/chat/ChatPage";
import React from "react";

const Chat = ({ params: { id } }) => {
  const [listening, setListening] = useState(false);
  return (
    <div className="w-full h-screen overflow-hidden">
      <ChatPage setListening={setListening} chatId={id} />
      {/* <div className="w-full h-52 bg-white">ss</div> */}
      <ChatInput listening={listening} />
    </div>
  );
};

export default Chat;
