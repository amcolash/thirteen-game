import firebase from 'firebase';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth, useUser, useDatabase, useDatabaseObjectData } from 'reactfire';
import { roomsPath, Room, usersPath, User, Card } from '../util/data';
import { generateGame } from '../util/generate';
import { playCard } from '../util/logic';
import PlayerHand from './PlayerHand';

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

  useEffect(() => {
    if (!room.game) return;

    const skipped = room.game.skipped || [];
    if (skipped.length === Object.values(room.members).length - 1) {
      const delay = 4000;

      const winner = Object.values(room.members).filter((u) => skipped.indexOf(u.id) === -1)[0];

      toast.info(`Round Over! ${winner ? (winner.id === user.id ? 'You win' : `${winner.nickname} wins`) : '??? wins'}`, {
        autoClose: delay,
      });
      console.log(`Round Over! ${winner ? (winner.id === user.id ? 'You win' : `${winner.nickname} wins`) : '??? wins'}`);

      const nextTurn = room.game.lastPlayer || user.id;

      // Only end game when neither computer nor player can play more
      const gameRef = db.ref(`${roomsPath}/${room.id}/game`);
      gameRef.update({
        lastCard: null,
        playedCards: [],
        turn: nextTurn,
        lastPlayer: null,
        skipped: [],
      });
    }
  }, [room, user.id, db]);

  // If the room was deleted, recover gracefully
  if (JSON.stringify(room) === '{}') {
    props.leaveRoom();
    return null;
  }

  const members = Object.values(room.members);
  const currentIndex = members.findIndex((u) => u.id === room.game?.turn);
  const ownerIndex = members.findIndex((u) => u.id === room.owner);

  return (
    <div>
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
      ) : !room.game ? (
        <div>Waiting for {members[ownerIndex].nickname} to deal</div>
      ) : null}
      {room.game ? (
        <div>
          {currentIndex > -1 && <div>Turn: {members[currentIndex].id === user.id ? 'You' : members[currentIndex].nickname}</div>}
          <PlayerHand user={user} game={room.game} playCard={(card?: Card) => playCard(room, user, roomRef, card)} />
        </div>
      ) : null}

      <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div>
          <span>Current Room: {room.name}</span>
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
