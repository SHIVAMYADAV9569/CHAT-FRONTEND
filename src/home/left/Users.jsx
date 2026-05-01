import React, { useEffect } from 'react';
import User from './User';
import userGetAllUsers from '../../context/userGetAllUsers';
import { useSocketContext } from '../../context/SocketContext.jsx';
import useUsersStore from '../../statemanage/useUsersStore.js';

function Users() {
  const [allUsers, loading] = userGetAllUsers();
  const { userUpdates } = useSocketContext();
  const updateUserProfile = useUsersStore((state) => state.updateUserProfile);

  // Update user profile when socket receives user update
  useEffect(() => {
    if (userUpdates?.userId && userUpdates?.userData) {
      updateUserProfile(userUpdates.userId, userUpdates.userData);
    }
  }, [userUpdates, updateUserProfile]);

  console.log(allUsers);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (!allUsers || allUsers.length <= 0) {
    return <div>No other users found.</div>;
  }

  return (
    <div
      className="py-2 flex-ankit overflow-y-auto"
      style={{ maxHeight: 'calc(84vh - 1vh)' }}
    >
      {allUsers.map((user, index) => (
        <User key={user._id || index} user={user} />
      ))}
    </div>
  );
}

export default Users;
