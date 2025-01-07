"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebarchat";
import ChatBox from "../../components/Chatbox";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen mt-[80px]">
      {/* Sidebar and Chat */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onSelectChat={(chatId, name) => {
          setSelectedChat(chatId);
          setSelectedChatName(name);
        }} />

        {/* ChatBox */}
        <ChatBox chatId={selectedChat} chatName={selectedChatName} />
      </div>
    </div>
  );
};

export default ChatPage;
