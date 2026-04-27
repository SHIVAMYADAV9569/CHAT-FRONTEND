import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';

function userGetAllUsers() {
  const [allUsers, setAllUsers] = useState({ filiteredUsers: [] });
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuth();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const headers = authUser?.token
          ? { Authorization: `Bearer ${authUser.token}` }
          : undefined;

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/getUserProfile`,
          { headers }
        );
        setAllUsers(response.data);
      } catch (error) {
        console.log('Error in userGetAllUsers', error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [authUser]);

  return [allUsers, loading];
}

export default userGetAllUsers;