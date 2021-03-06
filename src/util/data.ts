export const textColor = '#ccc';
export const backgroundColor = '#35654d';

export const roomsPath = '/rooms';
export const usersPath = `/users`;

export interface Game {
  deck: Deck;
  hands: { [user: string]: Card[] };
  playedCards: Card[];
  lastPlayed?: Card[];
  lastPlayer?: string;
  turn: string; // player making their move
  skipped?: string[];
}

export interface Room {
  id: string;
  name: string;
  password: string;
  owner: string;
  dealer: string;
  members: User[];

  game?: Game;
}

export interface User {
  id: string;
  email: string;
  currentRoom: string;
  nickname: string;
}

// Cards
export type Suite = 'S' | 'H' | 'C' | 'D';
export type CardValue = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'J' | 'Q' | 'K' | 'A' | 2;

export const suitOrdinal: { [suite in Suite]: number } = {
  H: 0,
  D: 1,
  C: 2,
  S: 3,
};

export const cardOrdinal: { [value in CardValue]: number } = {
  '3': 0,
  '4': 1,
  '5': 2,
  '6': 3,
  '7': 4,
  '8': 5,
  '9': 6,
  '10': 7,
  J: 8,
  Q: 9,
  K: 10,
  A: 11,
  '2': 12,
};

export interface Card {
  suit: Suite; // spades, hearts, clubs, diamonds
  value: CardValue; // number from 2-10, or string A, J, Q, K
}

export interface Deck {
  cards: Card[];
}
