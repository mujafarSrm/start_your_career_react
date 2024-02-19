import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/User/Users');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
        console.log("---line 15 ", data, users.role)
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.userId}>
            {user.firstName} {user.lastName} - {user.email} / {user.userId} / {user.role.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
