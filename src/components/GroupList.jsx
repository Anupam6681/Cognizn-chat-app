import React, { useState, useEffect } from "react";
import axios from "axios";
import JoinGroupModal from "./JoinGroupModal";
import ChatPage from "./ChatPage";
import './GroupList.css';
import { FaSignOutAlt } from "react-icons/fa";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const userid = localStorage.getItem("userid");
        const response = await axios.get(
          `http://localhost:3000/api/chat/conversations?userid=${userid}`
        );
        setUsername(response.data.username || '');
        setGroups(response.data.conversations || []);
      } catch (error) {
        console.error("Error fetching group list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleJoinGroupClick = (group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  const handleChatClick = (group) => {
    setSelectedGroup(group);
    setShowChat(true);
  };

  const handleBackToGroups = () => {
    setShowChat(false);
    setSelectedGroup(null);
  };

  const handleJoinGroupSubmit = (updatedGroup) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.sid === updatedGroup.sid ? updatedGroup : group
      )
    );
    setShowModal(false);
    setSelectedGroup(updatedGroup);
    setShowChat(true); // Automatically open chat after joining the group
  };
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userid");
    localStorage.removeItem("username");
    // Redirect to the login page
    window.location.href = "/login"; // or use history.push('/login') if using react-router
  };

  return (
    <div className="min-h-screen flex flex-col items-center " style={{background:"#eff6ff"}}>
      {showChat ? (
        <ChatPage 
          group={selectedGroup} 
          username={username}
          onBack={handleBackToGroups} 
        />
      ) : (
        <>
          <header className="text-white p-4 flex items-center justify-between rounded-b-lg shadow-lg w-full" style={{ background:"#6fa1ffe3" }}>
            <h1 className="text-lg font-semibold mx-auto">Chat Groups</h1>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-all duration-200"
              aria-label="Logout"
            >
              <FaSignOutAlt size={28} />
            </button>
          </header>
          
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          ) : (
            <div className="w-full max-w-6xl mx-auto p-6">
              {groups.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {groups.map((group) => (
                    <div
                      key={group.sid}
                      className="cursor-pointer bg-white shadow-lg rounded-lg p-4 hover:bg-blue-50 transition-all duration-200 mb-4"
                      style={{ minWidth: "300px" }}
                    >
                      <div className="flex items-center justify-between space-x-4">
                        <img
                          src={group.avatarUrl || "https://via.placeholder.com/50"}
                          alt={`${group.groupname || "Group Avatar"}`}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {group.groupname || "No group name available"}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {group.status === 1 ? (
                          <button
                            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200"
                            onClick={() => handleChatClick(group)}
                          >
                            Chat
                          </button>
                        ) : (
                          <button
                            className="text-blue-500 font-semibold flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-200"
                            onClick={() => handleJoinGroupClick(group)}
                            aria-label="Join Group"
                            style={{ textDecoration: 'none', minWidth: '105px' }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5 mr-1"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                              />
                            </svg>
                            Join Group
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No groups available</p>
              )}
            </div>
          )}

          {showModal && (
            <JoinGroupModal
              group={selectedGroup}
              onSubmit={handleJoinGroupSubmit}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GroupList;
