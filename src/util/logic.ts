import { toast } from 'react-toastify';
import { Card, cardOrdinal, Room, roomsPath, suitOrdinal, User } from './data';

export function playCard(room: Room, user: User, roomRef: firebase.database.Reference, card?: Card) {
  const game = room.game!;
  const hands = { ...game.hands };
  const playedCards = [...(game.playedCards || [])];
  const skipped = [...(game.skipped || [])];
  const turn = game.turn;

  if (card && hands[turn].indexOf(card) !== -1) {
    hands[turn] = hands[turn].filter((value: Card) => value !== card);
    playedCards.push(card);

    console.log(`Player ${turn + 1} played`, card);
  } else {
    skipped.push(turn);
    if (hands[turn].length > 0) console.log(`Player ${turn + 1} skipped`);
  }

  const members = Object.values(room.members);
  const currentIndex = members.findIndex((u) => u.id === game.turn);
  const nextIndex = (currentIndex + 1) % members.length;

  setTimeout(
    () => {
      const gameRef = roomRef.child('game');
      gameRef.update({
        hands,
        playedCards,
        skipped,
        lastCard: card || game.lastCard || null,
        lastPlayer: card ? turn : game.lastPlayer || null,
        turn: members[nextIndex].id,
      });
    },
    turn === user.id || card === undefined ? 0 : 1500
  );
}

export function cardWins(a: Card, b?: Card | null): boolean {
  if (!b || b === null) return true;

  if (a.value === b.value) {
    return suitOrdinal[a.suit] > suitOrdinal[b.suit];
  } else {
    return cardOrdinal[a.value] > cardOrdinal[b.value];
  }
}

export function checkAndHandleWin(room: Room, user: User, db: firebase.database.Database): void {
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
}

// https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940#gistcomment-3306762
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};
