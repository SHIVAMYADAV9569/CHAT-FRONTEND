import { useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthProvider.jsx';
import useUsersStore from '../statemanage/useUsersStore.js';

function userGetAllUsers() {
  const { authUser } = useAuth();
  const allUsers = useUsersStore((state) => state.allUsers);
  const loading = useUsersStore((state) => state.loadingUsers);
  const setAllUsers = useUsersStore((state) => state.setAllUsers);
  const setLoadingUsers = useUsersStore((state) => state.setLoadingUsers);

  useEffect(() => {
    const getUsers = async () => {
      setLoadingUsers(true);
      try {
        const headers = authUser?.token
          ? { Authorization: `Bearer ${authUser.token}` }
          : undefined;

        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/getUserProfile`,
          { headers }
        );
        setAllUsers(response.data.filiteredUsers || []);
      } catch (error) {
        console.log('Error in userGetAllUsers', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (authUser) {
      getUsers();
    }
  }, [authUser, setAllUsers, setLoadingUsers]);

  return [allUsers, loading];
}

export default userGetAllUsers;