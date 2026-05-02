import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider.jsx";
import toast from "react-hot-toast";

export default function StatusUploader() {
  const { authUser, setAuthUser } = useAuth();
  const [avatarFile, setAvatarFile] = useState(null);
  const [statusText, setStatusText] = useState("");
  const [statusMedia, setStatusMedia] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadAvatar = async () => {
    if (!avatarFile) {
      toast.error("Choose a profile picture first.");
      return;
    }
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${authUser?.token}` } }
      );
      toast.success("Profile picture updated.");
      const updatedUser = {
        ...authUser,
        user: {
          ...authUser.user,
          avatarUrl: response.data.user.avatarUrl,
        },
      };
      localStorage.setItem("messenger", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      setAvatarFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile picture.");
    } finally {
      setLoading(false);
    }
  };

  const uploadStatus = async () => {
    if (!statusText && !statusMedia) {
      toast.error("Write a status or upload an image/video.");
      return;
    }
    const formData = new FormData();
    if (statusText) formData.append("text", statusText);
    if (statusMedia) formData.append("media", statusMedia);
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/status`, formData, {
        headers: { Authorization: `Bearer ${authUser?.token}` },
      });
      toast.success("Status posted successfully.");
      
      // Update the auth user with new status
      const updatedUser = {
        ...authUser,
        user: {
          ...authUser.user,
          status: response.data.status,
        },
      };
      localStorage.setItem("messenger", JSON.stringify(updatedUser));
      setAuthUser(updatedUser);
      
      setStatusText("");
      setStatusMedia(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to post status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 md:px-6 py-4 border-t border-gray-700">
      <h2 className="text-lg font-semibold mb-2">Profile & Status</h2>
      <div className="space-y-3 text-sm text-gray-300">
        <label className="block">
          <span className="text-gray-400">Profile Picture</span>
          <input
            type="file"
            accept="image/*"
            className="mt-2 w-full text-sm"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
          />
        </label>
        <button
          className="btn btn-xs btn-primary"
          onClick={uploadAvatar}
          disabled={loading}
        >
          Upload DP
        </button>
      </div>
      <div className="mt-4 space-y-3 text-sm text-gray-300">
        <label className="block">
          <span className="text-gray-400">Status Text</span>
          <textarea
            rows="2"
            className="textarea textarea-bordered w-full bg-slate-900 text-white"
            value={statusText}
            onChange={(e) => setStatusText(e.target.value)}
            placeholder="Write a status update..."
          />
        </label>
        <label className="block">
          <span className="text-gray-400">Status Media</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="mt-2 w-full text-sm"
            onChange={(e) => setStatusMedia(e.target.files?.[0] || null)}
          />
        </label>
        <button
          className="btn btn-sm btn-secondary w-full md:w-auto"
          onClick={uploadStatus}
          disabled={loading}
        >
          Post Status
        </button>
      </div>
    </div>
  );
}
