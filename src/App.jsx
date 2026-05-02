import React, { useState } from 'react'
import Left from './home/left/Left'
import Right from './home/right/Right'
import Logout from './home/left1/Logout'
import Signup from './components/Signup'
import Login from "./components/Login";
import { Route, Routes } from 'react-router-dom'
import { useAuth } from "./context/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from 'react-router-dom';


function App() {
  const { authUser, setAuthUser } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  console.log(authUser);
  return (
    <>
      <Routes>
        <Route path="/" element={
          authUser ? (
            <div className="flex h-screen flex-col md:flex-row bg-slate-950">
              <div className="hidden md:flex md:w-[30%] lg:w-[26%] xl:w-[22%] flex-col">
                <Logout />
                <Left />
              </div>
              <Right isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-70" onClick={() => setIsSidebarOpen(false)}></div>
                  <div className="relative h-full w-11/12 max-w-sm bg-black text-gray-300 shadow-xl overflow-y-auto">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                      <h2 className="text-lg font-semibold">Profile & Status</h2>
                      <button className="text-white text-2xl" onClick={() => setIsSidebarOpen(false)}>×</button>
                    </div>
                    <Left />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Navigate to={"/login"} />
          )
        }
        />
        <Route path="/login" element={authUser ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/signup" element={authUser ? <Navigate to={"/"} /> : <Signup />} />
      </Routes>
      <Toaster />
    </>
  )
}
export default App