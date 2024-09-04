import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoArrowBack, IoSend } from 'react-icons/io5'; // Import the back and send icons

const ChatPage = ({ group, onBack, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true); // Loading state for messages
  const [loadingSend, setLoadingSend] = useState(false); // Loading state for sending
  const messagesEndRef = useRef(null); // Create a ref to scroll to the bottom

  useEffect(() => {
    console.log("currentUser", username);
    const fetchMessages = async () => {
      try {
        setLoadingMessages(true); // Start loading messages
        const response = await axios.get(
          `http://localhost:3000/api/chat/conversations/${group.sid}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false); // End loading messages
      }
    };

    fetchMessages();
  }, [group.sid]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        setLoadingSend(true); // Start loading send button
        await axios.post(
          `http://localhost:3000/api/chat/conversations/${group.sid}/messages`,
          {
            textmessage: newMessage,
            username: username, // Include the username in the request
          }
        );
        setNewMessage(""); // Clear the input field

        // Refresh messages after sending
        const response = await axios.get(
          `http://localhost:3000/api/chat/conversations/${group.sid}/messages`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoadingSend(false); // End loading send button
      }
    }
  };

  return (
    <>
      <style>
        {`
          .bg-chat {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          }
        `}
      </style>
      <div className="flex flex-col h-screen bg-chat" style={{ width: '100%' ,background:"#eff6ff"}} >
        <header className="text-white p-4 flex items-center rounded-b-lg shadow-lg" style={{ background: "#6fa1ffe3" }}>
          <button
            className="p-2 rounded-full hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-transform duration-150 ease-in-out transform hover:scale-105"
            onClick={onBack}
            aria-label="Go Back"
            style={{ background: "rgba(17, 73, 94, 0.42)" }}
          >
            <IoArrowBack className="text-lg" />
          </button>
          <h2 className="text-lg font-semibold mx-auto">{group.groupname}</h2>
        </header>

        <div
          className="flex-1 overflow-y-auto p-4 border border-gray-300 rounded-lg shadow-md"
          style={{ margin: '10px', backgroundColor: '#f8f9fa' }} // Add margin and background color for distinction
        >
          {loadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.sid}
                className={`flex ${message.username === username ? 'justify-end' : 'justify-start'} mb-4 mr-6`}
              >
                {message.username !== username && (
                  <div className="flex items-center">
                    <img
                      src={message.profileImageUrl || "https://via.placeholder.com/50"}
                      alt={message.username}
                      className="w-10 h-10 rounded-full mr-3"
                      style={{background:"darkgray",maxWidth:"39px",maxHeight:"39px"}}
                    />
                    <div className="max-w-xs p-3 bg-white rounded-lg shadow text-left overflow-hidden">
                      <strong className="block mb-1 text-sm font-medium truncate">{message.username}</strong>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
                    </div>
                  </div>
                )}
                {message.username === username && (
                  <div className="flex items-center">
                    <div className="max-w-xs p-3 text-white rounded-lg shadow text-right overflow-hidden" style={{ background: "#6fa1ffe3" }}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} /> {/* Empty div to use as the scroll target */}
        </div>

        <div
          className="p-4 bg-gradient-to-r from-white via-gray-50 to-gray-100 border-t border-gray-300 flex items-center rounded-t-lg shadow-md w-11/12 max-w-4xl mx-auto"
          style={{ marginBottom: '10px', borderRadius: '14px' }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-300 ease-in-out"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 rounded-full text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 transition-transform duration-150 ease-in-out transform hover:scale-105"
            aria-label="Send Message"
            disabled={loadingSend} // Disable button while sending message
            style={{ background: "#6fa1ffe3" }}
          >
            {loadingSend ? (
              <span className="loading loading-bars loading-sm text-white"></span> // Spinner during message send
            ) : (
              <IoSend className="text-xl" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
