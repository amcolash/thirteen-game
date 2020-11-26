import React, { Suspense, useEffect } from 'react';
import { Repeat } from 'react-feather';
import { useAuth, useDatabase, useDatabaseListData, useDatabaseObjectData, useUser } from 'reactfire';
import { style } from 'typestyle';
import { uniqueNamesGenerator, Config, adjectives, animals } from 'unique-names-generator';
import { v4 as uuidv4 } from 'uuid';

import { Room, roomsPath, User, usersPath } from '../util/data';
import { debounce } from '../util/logic';
import FancyInput from './FancyInput';
import Game from './Game';
import RoomList from './RoomList';

const randomNameClass = style({
  color: '#777',
  position: 'absolute',
  right: 12,
  top: 9,
  transition: 'all 0.5s',
  padding: 4,
  borderRadius: 3,

  $nest: {
    '&:hover': {
      background: '#ccc',
      color: '#555',
    },
  },
});

const nameGeneratorConfig: Config = {
  dictionaries: [adjectives, animals],
  separator: ' ',
  length: 2,
  style: 'capital',
};

const newRoom = (name: string, user: User, userRef: firebase.database.Reference, roomsRef: firebase.database.Reference) => {
  if (name.length > 0) {
    const room: Room = { id: uuidv4(), name, password: '', owner: user.id, members: [] };
    roomsRef.child(room.id).set({ ...room });

    changeRoom(user, userRef, roomsRef, room);
  }
};

const changeRoom = (user: User, userRef: firebase.database.Reference, roomsRef: firebase.database.Reference, newRoom?: Room) => {
  // Remove user from old room and optionally delete it if there are no more users in the room
  if (user.currentRoom && user.currentRoom.length > 0) {
    const roomRef = roomsRef.child(user.currentRoom);
    roomRef.once('value').then((v) => {
      const value: Room = v.val();

      if (value) {
        const members: User[] = Object.values(value.members);

        if (value !== null && (members.length === 1 || value.owner === user.id)) {
          roomRef.remove();
        } else if (value !== null) {
          roomRef.update({ members: members.filter((m: User) => m.id !== user.id) });
        }
      }
    });
  }

  if (newRoom) roomsRef.child(`${newRoom.id}/members`).push(user);

  userRef.update({ currentRoom: newRoom ? newRoom.id : null });
};

const randomName = (userRef: firebase.database.Reference, value: string) => userRef.update({ nickname: value });
const debouncedName = debounce(randomName, 1000);

const Rooms = () => {
  const auth = useAuth();
  const currentUser = useUser() as firebase.User;
  const db = useDatabase();

  // TODO: Bug here with a re-loin of an account during same session?
  const userRef = db.ref(`${usersPath}/${currentUser.uid}`);
  const user = useDatabaseObjectData(userRef) as User;

  const roomsRef = db.ref(roomsPath);
  const rooms = useDatabaseListData(roomsRef) as Room[];

  // Update user db node on creation and whenever the underlying data changes
  useEffect(() => {
    const userRef = db.ref(`${usersPath}/${currentUser.uid}`);
    userRef.update({
      email: currentUser.email,
      id: currentUser.uid,
      nickname: user.nickname !== undefined ? user.nickname : uniqueNamesGenerator(nameGeneratorConfig),
    });
  }, [currentUser, user, db]);

  return (
    <Suspense fallback="loading">
      {user.currentRoom ? (
        <Game currentRoom={user.currentRoom!} leaveRoom={() => changeRoom(user, userRef, roomsRef)} />
      ) : (
        <div>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <label>Nickname</label>
            <FancyInput
              placeholder="Enter a nickname"
              initialValue={user.nickname}
              onChange={(value: string) => debouncedName(userRef, value)}
            >
              <Repeat
                size={20}
                className={randomNameClass}
                onClick={() => userRef.update({ nickname: uniqueNamesGenerator(nameGeneratorConfig) })}
              />
            </FancyInput>
            <button style={{ marginLeft: 0 }} onClick={() => auth.signOut()}>
              Sign Out
            </button>
          </div>
          <RoomList
            rooms={rooms}
            newRoom={(roomName: string) => newRoom(roomName, user, userRef, roomsRef)}
            changeRoom={(room: Room) => changeRoom(user, userRef, roomsRef, room)}
          />
        </div>
      )}
    </Suspense>
  );
};

export default Rooms;
