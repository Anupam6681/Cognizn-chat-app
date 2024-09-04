import React, { useState } from "react";
import axios from "axios";
import "./JoinGroupModal.css";

const JoinGroupModal = ({ group, onSubmit, onClose }) => {
  const [username, setUsername] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!username || !photo) {
      setError("Both username and photo are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("sid", group.sid);
      formData.append("username", username);
      formData.append("userid", localStorage.getItem("userid"));
      formData.append("file", photo);

      const response = await axios.post(
        "http://localhost:3000/api/chat/add_participants",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        onSubmit({ ...group, status: 1 }); // Update the group status to 1 (joined)
      }
    } catch (e) {
      setError("Error submitting details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal modal-open flex justify-center items-center">
      <div className="modal-box max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h3 className="font-bold text-xl mb-4 text-gray-800" style={{textAlign: "center"}}>
          Join {group?.groupname}
        </h3>
        <p className="text-gray-600 mb-6">
          Please enter your username and upload a photo to join the group.
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your username"
            className="input input-bordered w-full p-3 mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative w-full">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handlePhotoChange}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm cursor-pointer hover:bg-blue-700 transition-colors duration-150 ease-in-out"
            >
              Upload Photo
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="modal-action flex justify-end gap-4">
          <button
            className="btn btn-secondary text-gray-600 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-800 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-md"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`btn text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-ring loading-lg"></span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;
