import firebase from 'firebase';
import React, { useEffect } from 'react';
import { useAuth, useUser, useDatabase, useDatabaseObjectData } from 'reactfire';
import { roomsPath, Room, usersPath, User, Card } from '../util/data';
import { generateGame } from '../util/generate';
import { checkAndHandleWin, playCard } from '../util/logic';
import PlayerCard from './PlayerCard';
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
    checkAndHandleWin(room, user, db);
  }, [room, user, db]);

  // If the room was deleted, recover gracefully
  if (JSON.stringify(room) === '{}') {
    props.leaveRoom();
    return null;
  }

  const members = Object.values(room.members);
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {room.game?.lastPlayed && <PlayerCard card={room.game.lastPlayed[0]} index={0} normal={true} />}
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
          {members.map((m) => {
            const isCurrentPlayer = m.id === room.game?.turn;
            const hasSkipped = (room.game?.skipped || []).indexOf(m.id) !== -1;

            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    padding: 5,
                    marginRight: 10,
                    textDecoration: hasSkipped ? 'line-through' : undefined,
                    fontWeight: isCurrentPlayer ? 'bold' : undefined,
                    border: isCurrentPlayer ? '1px solid white' : undefined,
                  }}
                >
                  {m.nickname}
                  {isCurrentPlayer ? '*' : ''}
                </div>
                <div>({room.game?.hands[m.id].length})</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Game;
