import firebase from 'firebase';
import React from 'react';
import { useAuth, useUser, useDatabase, useDatabaseObjectData } from 'reactfire';
import { Deck, Card, roomsPath, Room } from '../util/data';
import { shuffleDeck, generateDeck, generateHands } from '../util/generate';

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

  const numPlayers = 4;
  const deck = shuffleDeck(generateDeck());
  const hands = generateHands(numPlayers, deck);

  return (
    <div>
      <div>Game</div>
      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>Current Room: {props.currentRoom}</div>
        <div>
          <button onClick={() => props.leaveRoom()}>Leave Room</button>
        </div>
        <div>
          <button onClick={() => auth.signOut()}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default Game;
