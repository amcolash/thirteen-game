import firebase from 'firebase';
import React from 'react';
import { useAuth, useUser, useDatabase, useDatabaseObjectData } from 'reactfire';
import { roomsPath, Room, usersPath, User } from '../util/data';
import { generateGame } from '../util/generate';

interface GameProps {
  currentRoom: string;
  leaveRoom: () => void;
}

const Game = (props: GameProps) => {
  const auth = useAuth();
  const currentUser = useUser() as firebase.User;
  const db = useDatabase();

  const userRef = db.ref(`${usersPath}/${currentUser.uid}`);
  const user = useDatabaseObjectData(userRef) as User;

  const roomRef = db.ref(`${roomsPath}/${props.currentRoom}`);
  const room = useDatabaseObjectData(roomRef) as Room;

  // If the room was deleted, recover gracefully
  if (JSON.stringify(room) === '{}') {
    props.leaveRoom();
    return null;
  }

  const members = Object.values(room.members);

  return (
    <div>
      <div>Game</div>
      {currentUser.uid === room.owner && !room.game ? (
        <button
          onClick={() => {
            const game = generateGame(members, currentUser.uid);
            roomRef.update({ game });
          }}
          disabled={members.length < 2}
        >
          Deal{members.length < 2 ? ' (Need at least 2 players)' : ''}
        </button>
      ) : null}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>
          <span>Current Room: {props.currentRoom}</span>
          <button onClick={() => props.leaveRoom()}>{user.id === room.owner ? 'Close' : 'Leave'} Room</button>
        </div>
        <div>
          <span>{user.nickname}</span>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
        <div>
          <h3>Members</h3>
          {members.map((m) => (
            <div key={m.id}>{m.nickname}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
