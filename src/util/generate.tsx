import React, { CSSProperties } from 'react';
import { Deck, Card, Suite, CardValue, suitOrdinal, cardOrdinal } from './data';

export function generateDeck(): Deck {
  const cards: Card[] = [];
  const suits: Suite[] = ['S', 'H', 'C', 'D'];
  const values: CardValue[] = [3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A', 2];

  for (let s: number = 0; s < 4; s++) {
    for (let v: number = 0; v < 13; v++) {
      cards.push({ suit: suits[s], value: values[v] });
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

export function generateHands(numHands: number, deck: Deck): Card[][] {
  const hands: Card[][] = [];

  let player = 0;
  for (let i = 0; i < 52; i++) {
    if (!hands[player]) hands[player] = [];
    hands[player].push(deck.cards[i]);
    player = (player + 1) % numHands;
  }

  for (let h = 0; h < numHands; h++) {
    sortHand(hands[h]);
  }

  return hands;
}

export function sortHand(hand: Card[]): Card[] {
  hand.sort((a: Card, b: Card) => {
    if (a.value === b.value) {
      return suitOrdinal[a.suit] - suitOrdinal[b.suit];
    } else {
      return cardOrdinal[a.value] - cardOrdinal[b.value];
    }
  });

  return hand;
}

export function cardWins(a: Card, b?: Card): boolean {
  if (b === undefined) return true;

  if (a.value === b.value) {
    return suitOrdinal[a.suit] > suitOrdinal[b.suit];
  } else {
    return cardOrdinal[a.value] > cardOrdinal[b.value];
  }
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

  return (
    <div
      style={{
        color,
        display: 'flex',
        flexDirection: vertical ? (reverse ? 'column-reverse' : 'column') : reverse ? 'row-reverse' : 'row',
        ...style,
      }}
      key={suit + card.value}
    >
      <div>{suit}</div>
      <div>{card.value}</div>
    </div>
  );
}
