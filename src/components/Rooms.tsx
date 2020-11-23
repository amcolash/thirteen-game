import React, { Suspense, useState } from 'react';
import { useAuth, useDatabase, useDatabaseListData, useDatabaseObjectData } from 'reactfire';
import { v4 as uuidv4 } from 'uuid';
import { Room, User } from '../util/data';

import Game from './Game';

const roomsPath = '/rooms';
const usersPath = `/users`;

const newRoom = (name: string, user: User, userRef: firebase.database.Reference, roomsRef: firebase.database.Reference) => {
  if (name.length > 0) {
    const room: Room = { id: uuidv4(), name, password: '', owner: user.id, members: [user.id] };
    roomsRef.child(room.id).set({ ...room });
    changeRoom(user, userRef, roomsRef, room);
  }
};

const changeRoom = (user: User, userRef: firebase.database.Reference, roomsRef: firebase.database.Reference, newRoom?: Room) => {
  // Remove user from old room and optionally delete it if there are no more users in the room
  if (user.currentRoom && user.currentRoom.length > 0) {
    const roomRef = roomsRef.child(user.currentRoom);
    roomRef.once('value').then((v) => {
      const value = v.val();
      if (value !== null && value.members.length === 1) {
        roomRef.remove();
      } else if (value !== null) {
        roomRef.update({ members: value.members.filter((m: string) => m !== user.id) });
      }
    });
  }

  userRef.update({ currentRoom: newRoom ? newRoom.id : null });
};

const Rooms = () => {
  const [roomName, setRoomName] = useState('');

  const auth = useAuth();
  const db = useDatabase();

  const userRef = db.ref(`${usersPath}/${auth.currentUser?.uid}`);
  const roomsRef = db.ref(roomsPath);

  const user = useDatabaseObjectData(userRef) as User;
  const rooms = useDatabaseListData(roomsRef) as Room[];

  return (
    <Suspense fallback="loading">
      {user.currentRoom ? (
        <Game currentRoom={user.currentRoom!} leaveRoom={() => changeRoom(user, userRef, roomsRef)} />
      ) : (
        <div>
          <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => auth.signOut()}>
            Sign Out
          </button>
          <h1>Rooms</h1>
          <div>
            <div style={{ marginBottom: 20 }}>
              <Suspense fallback={<div>Loading Rooms</div>}>
                {rooms.length === 0 ? (
                  <div>No Available Rooms</div>
                ) : (
                  Object.values(rooms).map((room: Room) => (
                    <div key={room.id} onClick={() => changeRoom(user, userRef, roomsRef, room)}>
                      {room.name}
                    </div>
                  ))
                )}
              </Suspense>
            </div>
            <input
              type="text"
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setRoomName('');
                  newRoom(roomName, user, userRef, roomsRef);
                }
              }}
            />
            <button
              onClick={() => {
                setRoomName('');
                newRoom(roomName, user, userRef, roomsRef);
              }}
            >
              New Room
            </button>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default Rooms;
