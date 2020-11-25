import React, { Suspense, useEffect } from 'react';
import { useAuth, useDatabase, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import { v4 as uuidv4 } from 'uuid';

import { Room, roomsPath, User, usersPath } from '../util/data';
import Game from './Game';
import RoomList from './RoomList';

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
  const auth = useAuth();
  const currentUser = useUser() as firebase.User;
  const db = useDatabase();

  const userRef = db.ref(`${usersPath}/${currentUser.uid}`);
  const roomsRef = db.ref(roomsPath);

  // Update user db node on creation and whenever the underlying data changes
  useEffect(() => {
    userRef.update({ email: currentUser.email, id: currentUser.uid });
  }, [currentUser, userRef]);

  // TODO: Bug here with a re-loin of an account during same session?
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
          <RoomList
            rooms={rooms}
            newRoom={(roomName: string) => newRoom(roomName, user, userRef, roomsRef)}
            testRoom={() => {
              const room: Room = { id: uuidv4(), name: 'test' + Math.random(), password: '', owner: user.id, members: [user.id] };
              roomsRef.child(room.id).set({ ...room });
            }}
            changeRoom={(room: Room) => changeRoom(user, userRef, roomsRef, room)}
          />
        </div>
      )}
    </Suspense>
  );
};

export default Rooms;
