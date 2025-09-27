import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import userGetAllUsers from "../../context/userGetAllUsers.jsx";
import useConversation from "../../statemanage/useConversation.js";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const allUsers = userGetAllUsers(); // ✅ check karo hook kya return karta hai
  const { setSelectedConversation } = useConversation();
  console.log("all users" ,allUsers);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const conversation = allUsers[0].filiteredUsers.find((user) =>
      user.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else {
      toast.error("User not found");
    }
  };

  return (
    <div className="h-[10vh]">
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex space-x-3">
            <label className="border border-gray-700 bg-slate-900 rounded-lg flex items-center gap-2 w-[80%] p-3">
              <input
                type="text"
                className="grow outline-none bg-transparent text-white"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button type="submit">
              <IoSearch className="text-5xl p-2 hover:bg-gray-600 rounded-full duration-300 cursor-pointer" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
