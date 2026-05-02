import React from 'react'
import Search from './Search';
import Users from './Users';
import StatusUploader from './StatusUploader.jsx';

function left() {
  return (
    <div className="w-full bg-black text-gray-300 min-h-screen">
      <div className="px-4 md:px-6 py-4 border-b border-gray-700">
        <h1 className="font-bold text-3xl md:text-4xl">Chats</h1>
      </div>
      <Search />
      <hr className="border-gray-700" />
      <StatusUploader />
      <hr className="border-gray-700" />
      <Users />
    </div>
  );
}

export default left