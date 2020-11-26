import firebase from 'firebase/app';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { style } from 'typestyle';
import { Card, Deck } from '../util/data';

import { generateCardInfo, sortHand } from '../util/generate';
import { cardsWin } from '../util/logic';

import DebugDeck from './DeckDebug';
import PlayerCard from './PlayerCard';
import PlayerHand from './PlayerHand';

const appStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

interface GameOldProps {
  currentRoom: string;
  leaveRoom: () => void;
}

interface GameOldState {
  deck: Deck;
  hands: Card[][];
  numPlayers: number;
  playedCards: Card[];
  lastCard?: Card;
  lastPlayer?: number;
  currentPlayer: number; // the player to show deck for
  turn: number; // player making their move
  skipped: boolean[];
}

export default class GameOld extends React.Component<GameOldProps, GameOldState> {
  constructor(props: GameOldProps) {
    super(props);

    // const numPlayers = 4;
    // const deck = shuffleDeck(generateDeck());
    // const hands = generateHands(numPlayers, deck);

    // this.state = {
    //   deck,
    //   hands,
    //   numPlayers,
    //   playedCards: [],
    //   currentPlayer: 0,
    //   turn: 0,
    //   skipped: new Array(numPlayers).fill(false),
    // };
  }

  componentDidUpdate() {
    this.handleTurn();
  }

  playCard(card?: Card) {
    const hands = [...this.state.hands];
    const playedCards = [...this.state.playedCards];
    const skipped = [...this.state.skipped];
    const turn = this.state.turn;

    if (card && hands[turn].indexOf(card) !== -1) {
      hands[turn] = hands[turn].filter((value: Card) => value !== card);
      playedCards.push(card);

      console.log(`Player ${turn + 1} played`, card);
    } else {
      skipped[this.state.turn] = true;
      if (hands[turn].length > 0) console.log(`Player ${turn + 1} skipped`);
    }

    setTimeout(
      () => {
        this.setState({
          hands,
          playedCards,
          skipped,
          lastCard: card || this.state.lastCard,
          lastPlayer: card ? turn : this.state.lastPlayer,
          turn: (turn + 1) % this.state.numPlayers,
        });
      },
      turn === this.state.currentPlayer || card === undefined ? 0 : 1500
    );
  }

  chooseCard(hand: Card[], lastPlayed?: Card[]): Card | undefined {
    const sorted = sortHand(hand);

    if (!lastPlayed) return sorted[0];
    else {
      for (let i = 0; i < sorted.length; i++) {
        const card = sorted[i];
        if (cardsWin([card], lastPlayed)) return card;
      }
    }
  }

  handleTurn() {
    let cardsLeft = 0;
    this.state.hands.forEach((hand: Card[]) => {
      hand.forEach((c: Card) => cardsLeft++);
    });

    if (cardsLeft === 0) return;
    if (this.state.turn === -1) return;

    if (this.state.turn !== this.state.currentPlayer && !this.state.skipped[this.state.turn]) {
      // const chosen = this.chooseCard(this.state.hands[this.state.turn], this.state.lastPlayed);
      // this.playCard(chosen);
    } else if (!this.state.skipped[this.state.currentPlayer]) {
      const hand = this.state.hands[this.state.currentPlayer];
      const sorted = sortHand(hand);
      let skip: boolean = true;
      for (let i = 0; i < sorted.length; i++) {
        // const card = sorted[i];
        // if (cardWins(card, this.state.lastCard)) skip = false;
      }

      if (skip) {
        if (hand.length > 0) console.log(`Player ${this.state.currentPlayer + 1} skipped`);

        const skipped = [...this.state.skipped];
        skipped[this.state.currentPlayer] = true;
        this.setState({ skipped, turn: (this.state.turn + 1) % this.state.numPlayers });
      }
    } else {
      const delay = 4000;

      toast.info(`Round Over! Player ${this.state.lastPlayer! + 1} wins`, { autoClose: delay });
      console.log(`Round Over! Player ${this.state.lastPlayer! + 1} wins`);
      console.log('--------------------------------------------------------------------');

      const turn = this.state.lastPlayer || this.state.currentPlayer;

      // Only end game when neither computer nor player can play more
      this.setState({
        lastCard: undefined,
        playedCards: [],
        turn: -1,
        lastPlayer: undefined,
        skipped: new Array(this.state.numPlayers).fill(false),
      });

      setTimeout(() => {
        this.setState({ turn });
      }, delay / 2);
    }
  }

  render(): React.ReactNode {
    return (
      <div className={appStyle}>
        <ToastContainer hideProgressBar />
        <DebugDeck hands={this.state.hands} turn={this.state.turn} />

        <h2>Played Cards</h2>
        {this.state.lastCard && <PlayerCard card={this.state.lastCard} index={0} />}
        <div style={{ display: 'flex', maxWidth: '90vw', flexWrap: 'wrap' }}>
          {this.state.playedCards.map((card: Card) => generateCardInfo(card, false, false, { padding: 4 }))}
        </div>

        {/* <PlayerHand
          player={this.state.currentPlayer}
          turn={this.state.turn}
          lastCard={this.state.lastCard}
          hand={this.state.hands[this.state.currentPlayer]}
          playCard={(card: Card) => this.playCard(card)}
        /> */}
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <div>Current Room: {this.props.currentRoom}</div>
          <div>
            <button onClick={() => this.props.leaveRoom()}>Leave Room</button>
          </div>
          <div>
            <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
          </div>
          <div>
            <h3>Cards Left</h3>
            {this.state.hands.map((h, i) => (
              <div>
                Player {i + 1}: {h.length}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
