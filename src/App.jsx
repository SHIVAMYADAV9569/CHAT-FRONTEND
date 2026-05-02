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
            <div className="flex h-screen">
              <div className="hidden md:flex">
                <Logout />
                <Left />
              </div>
              <Right isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
              {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
                  <div className="relative w-80 bg-black text-gray-300 h-full">
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