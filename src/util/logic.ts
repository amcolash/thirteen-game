import { Card, cardOrdinal, Room, suitOrdinal, User } from './data';

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
