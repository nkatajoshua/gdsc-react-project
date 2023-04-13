import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { firebaseConfig } from '../../Base/firebaseConfig';


firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);

  useEffect(() => {
    const membersRef = db.ref('members');
    const listener = membersRef.on('value', (snapshot) => {
      const newMembers = [];

      snapshot.forEach((childSnapshot) => {
        const id = childSnapshot.key;
        const data = childSnapshot.val();
        newMembers.push({ id, ...data });
      });

      setMembers(newMembers);
    });

    return () => membersRef.off('value', listener);
  }, []);

  const handleAddMember = (event) => {
    event.preventDefault();
    const { name, email } = event.target.elements;

    db.ref('members').push({
      name: name.value,
      email: email.value,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });

    name.value = '';
    email.value = '';
  };

  const handleDeleteMember = (id) => {
    db.ref(`members/${id}`).remove();
  };

  const handleEditMember = (member) => {
    setEditMember(member);
  };

  const handleUpdateMember = (event) => {
    event.preventDefault();
    const { name, email } = event.target.elements;

    db.ref(`members/${editMember.id}`).update({
      name: name.value,
      email: email.value
    });

    setEditMember(null);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <form onSubmit={handleAddMember}>
        <label>
          Name:
          <input type="text" name="name" />
        </label>

        <label>
          Email:
          <input type="email" name="email" />
        </label>

        <button type="submit">Add Member</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <button onClick={() => handleDeleteMember(member.id)}>Delete</button>
                <button onClick={() => handleEditMember(member)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editMember && (
        <form onSubmit={handleUpdateMember}>
          <h2>Edit Member</h2>
          <label>
            Name:
            <input type="text" name="name" defaultValue={editMember.name} />
          </label>

          <label>
            Email:
            <input type="email" name="email" defaultValue={editMember.email} />
          </label>

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditMember(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
