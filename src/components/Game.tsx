import firebase from 'firebase';
import React from 'react';
import { useAuth, useUser, useDatabase, useDatabaseObjectData } from 'reactfire';
import { Deck, Card, roomsPath, Room } from '../util/data';
import { shuffleDeck, generateDeck, generateHands, generateGame } from '../util/generate';

interface GameProps {
  currentRoom: string;
  leaveRoom: () => void;
}

const Game = (props: GameProps) => {
  const auth = useAuth();
  const currentUser = useUser() as firebase.User;
  const db = useDatabase();

  const roomRef = db.ref(`${roomsPath}/${props.currentRoom}`);
  const room = useDatabaseObjectData(roomRef) as Room;

  return (
    <div>
      <div>Game</div>
      {currentUser.uid === room.owner && !room.game ? (
        <button
          onClick={() => {
            const game = generateGame(room.members, currentUser.uid);
            roomRef.update({ game });
          }}
          disabled={room.members.length < 2}
        >
          Deal{room.members.length < 2 ? ' (Need at least 2 players)' : ''}
        </button>
      ) : null}
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>Current Room: {props.currentRoom}</div>
        <div>
          <button onClick={() => props.leaveRoom()}>Leave Room</button>
        </div>
        <div>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
        <div>
          <h3>Members</h3>
          {room.members.map((m) => (
            <div>{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
