import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider.jsx";
import { IoHeart, IoEye, IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

function StatusViewer({ user, isOpen, onClose, onStatusUpdate }) {
  const { authUser } = useAuth();
  const [status, setStatus] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user?.status) {
      setStatus(user.status);
      setIsLiked(
        user.status.likes?.some((like) => like.userId === authUser?.user?._id || like.userId?._id === authUser?.user?._id)
      );
      recordView();
    }
  }, [isOpen, user]);

  const recordView = async () => {
    try {
      if (!user?._id || !authUser?.user?._id) return;
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/status/${user._id}/view`,
        {},
        { headers: { Authorization: `Bearer ${authUser?.token}` } }
      );
      setStatus(response.data.status);
      onStatusUpdate?.(user._id);
    } catch (error) {
      console.error("Error recording view:", error);
    }
  };

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/status/${user._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${authUser?.token}` } }
      );
      setStatus(response.data.status);
      setIsLiked(!isLiked);
      onStatusUpdate?.(user._id);
    } catch (error) {
      console.error("Error liking status:", error);
      toast.error("Failed to like status");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user || !status) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 sticky top-0 bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    user.avatarUrl ||
                    "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                  }
                  alt={user.name}
                />
              </div>
            </div>
            <div>
              <h2 className="font-bold text-white">{user.name}</h2>
              <p className="text-xs text-gray-400">
                {status.postedAt
                  ? new Date(status.postedAt).toLocaleString()
                  : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle text-white hover:bg-gray-700"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Status Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Text Status */}
          {status.text && (
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 rounded-lg min-h-[200px] flex items-center justify-center">
              <p className="text-white text-2xl font-semibold text-center">
                {status.text}
              </p>
            </div>
          )}

          {/* Media Status */}
          {status.mediaUrl && (
            <div className="rounded-lg overflow-hidden bg-black">
              {status.type === "video" ? (
                <video
                  src={status.mediaUrl}
                  controls
                  className="w-full max-h-96 object-contain"
                />
              ) : (
                <img
                  src={status.mediaUrl}
                  alt="Status"
                  className="w-full max-h-96 object-contain"
                />
              )}
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={loading}
            className={`btn gap-2 ${
              isLiked
                ? "btn-error"
                : "btn-outline btn-error hover:btn-error hover:bg-red-600"
            }`}
          >
            <IoHeart size={18} />
            Like ({status.likes?.length || 0})
          </button>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-blue-400 font-semibold">
                <IoEye size={18} />
                {status.viewers?.length || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">Views</p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-red-400 font-semibold">
                <IoHeart size={18} />
                {status.likes?.length || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">Likes</p>
            </div>
          </div>

          {/* Likes List */}
          {status.likes && status.likes.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <IoHeart size={16} className="text-red-500" /> Liked by
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {status.likes.map((like, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-6 rounded-full">
                        <img
                          src={
                            like.avatarUrl ||
                            "https://img.daisyui.com/images/profile/demo/gordon@192.webp"
                          }
                          alt={like.name}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-200">{like.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Viewers List */}
          {status.viewers && status.viewers.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <IoEye size={16} className="text-blue-500" /> Viewed by
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {status.viewers.map((viewer, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm text-gray-200">{viewer.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusViewer;
