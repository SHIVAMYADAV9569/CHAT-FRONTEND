import React, { useState } from 'react';
import { IoLogOutOutline } from 'react-icons/io5';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export default function Logout() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/user/logout`);
      localStorage.removeItem('messenger');
      Cookies.remove('jwt');
      setLoading(false);
      toast.success('Logout Successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Field to Logout");
    }
  };

  return (
    <div className="w-[4%] bg-slate-950 text-white flex flex-col justify-end">
      <div className="p-3 align-bottom">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center justify-center"
        >
          <IoLogOutOutline className="text-5xl p-2 hover:bg-gray-600 rounded-lg duration-300 cursor-pointer" />
        </button>
      </div>
    </div>
  );
}
