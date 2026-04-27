import React from 'react';
import User from './User';
import userGetAllUsers from '../../context/userGetAllUsers';

function Users() {
  const [allUsers, loading] = userGetAllUsers();
  console.log(allUsers.filiteredUsers);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (allUsers.filiteredUsers.length <= 0) {
    return <div>No other users found.</div>;
  }

  return (
    <div
      className="py-2 flex-ankit overflow-y-auto"
      style={{ maxHeight: 'calc(84vh - 1vh)' }}
    >
      {
      allUsers.filiteredUsers.map((user, index) => (
        <User key={user.id || index} user={user} />
      ))
      }
    </div>
  );
}

export default Users;
