import React, { CSSProperties } from 'react';

export interface Card {
  suit: 'S' | 'H' | 'C' | 'D'; // spades, hearts, clubs, diamonds
  value: number; // where number is from 1-13, 1-9 = normal, 10 = J, 11 = Q, 12 = K, 13 = A
}

export interface Deck {
  cards: Card[];
}

export function generateDeck(): Deck {
  const cards: Card[] = [];
  const suits: ('S' | 'H' | 'C' | 'D')[] = ['S', 'H', 'C', 'D'];

  for (let s: number = 0; s < 4; s++) {
    for (let v: number = 1; v < 14; v++) {
      cards.push({ suit: suits[s], value: v });
    }
  }

  return { cards };
}

// From https://stackoverflow.com/a/2450976/2303432
function shuffle(array: any[]): any[] {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function shuffleDeck(deck: Deck): Deck {
  return { cards: shuffle(deck.cards) };
}

// Warning: This function will modify the underlying deck in place! Be warned if using react state and make sure to make a clone of the
// array and then set a new state after
export function generateHand(numCards: number, deck: Deck): Card[] {
  const hand: Card[] = deck.cards.splice(0, numCards);

  return hand;
}

export function generateCardInfo(card: Card, vertical: boolean, reverse: boolean, style?: CSSProperties): React.ReactNode {
  let suit;
  let color;
  switch (card.suit) {
    case 'C':
      color = 'black';
      suit = '♣';
      break;
    case 'D':
      color = 'red';
      suit = '♦';
      break;
    case 'H':
      color = 'red';
      suit = '♥';
      break;
    case 'S':
      color = 'black';
      suit = '♠';
      break;
  }
  let value: string | number = card.value;
  switch (value) {
    case 10:
      value = 'J';
      break;
    case 11:
      value = 'Q';
      break;
    case 12:
      value = 'K';
      break;
    case 13:
      value = 'A';
      break;
  }

  return (
    <div
      style={{
        color,
        display: 'flex',
        flexDirection: vertical ? (reverse ? 'column-reverse' : 'column') : reverse ? 'row-reverse' : 'row',
        ...style,
      }}
    >
      <div>{suit}</div>
      <div>{value}</div>
    </div>
  );
}
