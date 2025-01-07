"use client";
import { useState, useEffect , useRef} from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../../app/config";

// Initialize the socket connection
var socket ;

// Define the message interface
interface Message {
  senderId: string;
  content: string;
}

interface ChatBoxProps {
  chatId: string | null;
  chatName?: string;

}
//get user from local storage
let user = {};

if (typeof window !== "undefined" && localStorage.getItem("user")) {
  user = JSON.parse(localStorage.getItem("user") || "{}");
}

const ChatBox = ({ chatId,chatName}: ChatBoxProps ) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
const [isScrolledUp, setIsScrolledUp] = useState(false);



  // Fetch previous messages for a selected chat
  const fetchMessages = async () => {
    if (!chatId) return;

    setLoading(true);
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  
  if (!token) {
    console.error("Authentication token not found.");
    return;
  }

const tokenValue = token.split("=")[1];

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/v1/chat/messages/${chatId}`,
        {
          headers: { Authorization: `Bearer ${tokenValue}` },
        }
      );

      setMessages(response.data.messages);
      setLoading(false);

      // Join the chat room via Socket.IO
      socket.emit("join chat", chatId);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (messageContent.trim() === "") return;
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  
  if (!token) {
    console.error("Authentication token not found.");
    return;
  }

const tokenValue = token.split("=")[1];
  setNewMessage("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/chat/send-message`,
        { chatId, content: messageContent },
        { headers: { Authorization: `Bearer ${tokenValue}` } }
      );

      const sentMessage = response.data.message;
      console.log("Sent message:", sentMessage);
      
      // Emit a new message to the server for real-time updates
      socket.emit("new message", sentMessage);

      // Update UI with the newly sent message
      setMessages([...messages, sentMessage]);
      console.log("Message sent successfully:", messages);
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  useEffect(() => {
    socket = io(`${BACKEND_URL}`);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    fetchMessages();

    // eslint-disable-next-line
  }, [chatId]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  

  useEffect(() => {
    const handleNewMessage = (newMessageRecieved: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
     
      //@ts-ignore
      toast.info(`A new message has arrived from ${newMessageRecieved.sender.fullname}`);
    };
  
    if (socket) {
      socket.on("message recieved", handleNewMessage);
    }
  
    // Cleanup the listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("message recieved", handleNewMessage);
      }
    };
  }, [socket, messages]);
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setIsScrolledUp(scrollTop + clientHeight < scrollHeight - 100); // Check if not near the bottom
      }
    };
  
    const container = messagesContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);
  

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200  h-3/2">
  {/* Chat Header */}
  <ToastContainer />
  <div className="p-4 bg-blue-600 dark:bg-blue-800 border-b shadow-md flex items-center justify-between">
    <h2 className="text-lg font-semibold text-white">Chat with {chatName}</h2>
  </div>

  {/* Messages Container */}
  <div
  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-inner h-3/4"
  ref={messagesContainerRef}
>
  {loading ? (
    <div className="text-center text-sm text-gray-500">Loading messages...</div>
  ) : (
    messages.map((message, index) => (
      <div
        key={index}
        className={`${
          //@ts-ignore
          message.senderId === user.id
            ? "ml-auto bg-blue-500 text-white"
            : "mr-auto bg-gray-300 text-gray-800"
        } text-sm p-3 my-2 rounded-lg max-w-[20%] relative shadow-md transition-all duration-300 transform hover:scale-105`}
      >
        <p className="break-words">{message.content}</p>
      </div>
    ))
  )}
  <div ref={messagesEndRef}></div>
  {isScrolledUp && (
  <button
    onClick={scrollToBottom}
    className="fixed bottom-16 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 focus:outline-none"
  >
    ↓ Scroll to Bottom
  </button>
)}
</div>



  {/* Input Section */}
  <div className="p-4 bg-white dark:bg-gray-900 border-t shadow-lg flex items-center space-x-4 rounded-lg">
    <input
      type="text"
      className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300"
      placeholder="Type your message..."
      value={messageContent}
      onChange={(e) => setMessageContent(e.target.value)}
    />
    <button
      onClick={sendMessage}
      className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-6 py-3 rounded-lg shadow-md focus:outline-none"
    >
      Send
    </button>
   
  </div>
  

</div>

  );
};

  export default ChatBox;