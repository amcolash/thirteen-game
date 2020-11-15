import React from 'react';
import { style } from 'typestyle';
import { Card, Deck, generateCardInfo, generateDeck, generateHands, shuffleDeck } from '../util/generate';
import DebugDeck from './DeckDebug';
import PlayerHand from './PlayerHand';

const appStyle = style({
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',

  background: '#35654d',
  color: '#ccc',
  textShadow: '1px 1px black',
  fontFamily: 'sans-serif',
  userSelect: 'none',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

interface GameState {
  deck: Deck;
  hands: Card[][];
  numPlayers: number;
  playedCards: Card[];
  currentPlayer: number; // the player to show deck for
  turn: number; // player making their move
}

class App extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props);

    const numPlayers = 4;
    const currentPlayer = 0;
    const deck = shuffleDeck(generateDeck());
    const hands = generateHands(numPlayers, deck);

    this.state = {
      deck,
      hands,
      numPlayers,
      playedCards: [],
      currentPlayer,
      turn: 0,
    };
  }

  playCard(card?: Card) {
    const hands = [...this.state.hands];
    const playedCards = [...this.state.playedCards];
    const turn = this.state.turn;

    if (card) {
      hands[turn] = hands[turn].filter((value: Card) => value !== card);
      playedCards.push(card);
    }

    setTimeout(
      () => {
        this.setState({ hands, playedCards, turn: (turn + 1) % this.state.numPlayers });
      },
      turn === this.state.currentPlayer ? 0 : 1500
    );
  }

  componentDidUpdate() {
    if (this.state.turn !== this.state.currentPlayer) {
      const hand = this.state.hands[this.state.turn];
      this.playCard(hand[0]);
    }
  }

  render(): React.ReactNode {
    return (
      <div className={appStyle}>
        <DebugDeck hands={this.state.hands} turn={this.state.turn} />

        <h2>Played Cards</h2>
        <div style={{ display: 'flex', maxWidth: '90vw', flexWrap: 'wrap' }}>
          {this.state.playedCards.map((card: Card) => generateCardInfo(card, false, false, { padding: 4 }))}
        </div>

        <PlayerHand
          player={this.state.currentPlayer}
          turn={this.state.turn}
          hand={this.state.hands[this.state.currentPlayer]}
          playCard={(card: Card) => this.playCard(card)}
        />
      </div>
    );
  }
}

export default App;
