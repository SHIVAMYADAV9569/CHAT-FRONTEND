import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import userGetAllUsers from "../../context/userGetAllUsers.jsx";
import useConversation from "../../statemanage/useConversation.js";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers] = userGetAllUsers();
  const { setSelectedConversation } = useConversation();
  console.log("all users", allUsers);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      toast.error("Please enter a name");
      return;
    }

    const conversation = (allUsers || []).find((user) =>
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
      <div className="px-4 md:px-6 py-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-3">
            <label className="border border-gray-700 bg-slate-900 rounded-lg flex items-center gap-2 flex-1 min-w-0 p-3">
              <input
                type="text"
                className="grow outline-none bg-transparent text-white"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button type="submit" className="rounded-full bg-slate-900 p-3 hover:bg-gray-700 transition-colors duration-200">
              <IoSearch className="text-3xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
