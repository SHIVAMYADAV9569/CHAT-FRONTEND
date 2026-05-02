import React from 'react'
import Search from './Search';
import Users from './Users';
import StatusUploader from './StatusUploader.jsx';

function left() {
  return (
    <div className="w-full bg-black text-gray-300">
      <h1 className="font-bold text-3xl p-2 px-4 md:px-11">Chats</h1>
      <Search />
      <hr />
      <StatusUploader />
      <hr />
      <Users />
    </div>
  );
}

export default left