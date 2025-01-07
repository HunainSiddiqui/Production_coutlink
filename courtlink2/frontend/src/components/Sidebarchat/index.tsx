import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

type Chat = {
  id: string;
  user2Id: string;
  user1Name: string;
  hasNewMessage: boolean;
};

interface SidebarProps {
  onSelectChat: (chatId: string, name: string) => void;
}

let user = {};

if (typeof window !== "undefined" && localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user") || "{}");
}

const Sidebar = ({ onSelectChat }: SidebarProps) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="));

        if (!token) {
          console.error("Authentication token not found.");
          return;
        }

        const tokenValue = token.split("=")[1];

        const res = await axios.get(
          "http://localhost:3000/api/v1/chat/my-chats",
          {
            headers: { Authorization: `Bearer ${tokenValue}` },
          },
        );

        setChats(res.data.chats);
      } catch (error) {
        console.error("Error fetching chats", error);
      }
    };

    fetchChats();
  }, []);

  // Filter chats based on search query
  const filteredChats = chats.filter((chat) => {
    //@ts-ignore
    if (chat.user1Id === user.id) {
      //@ts-ignore
      return chat.user2Name.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return chat.user1Name.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  return (
    <div className="flex h-screen w-1/4 flex-col bg-gradient-to-tl from-gray-800 via-gray-900 to-black text-white shadow-xl">
      {/* Header with Gradient */}
      <div className="rounded-b-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-5 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-extrabold tracking-wide">
          Chats
        </h1>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-500" />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="flex transform cursor-pointer items-center rounded-xl bg-gray-700 from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg transition-transform duration-200 hover:scale-105 hover:bg-gradient-to-r"
              onClick={() => {
                //@ts-ignore
                onSelectChat(
                  chat.id,
                  //@ts-ignore
                  user.fullname === chat.user1Name ? chat.user2Name : chat.user1Name,
                );
              }}
            >
              {/* Avatar */}
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                {
                  //@ts-ignore
                  (user.fullname === chat.user1Name ? chat.user2Name
                    : chat.user1Name
                  )
                    .charAt(0)
                    .toUpperCase()
                }
              </div>

              {/* Chat Name */}
              <div className="flex-1">
                <p className="text-lg font-semibold">
                  {
                    //@ts-ignore
                    user.fullname === chat.user1Name ? chat.user2Name : chat.user1Name
                  }
                </p>
                <p className="text-sm text-gray-400">Last message preview...</p>
              </div>

              {/* New Message Indicator */}
              {chat.hasNewMessage && (
                <span className="ml-2 h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
              )}
            </div>
          ))
        ) : (
          <div className="mt-10 text-center text-sm text-gray-400">
            No chats found
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
