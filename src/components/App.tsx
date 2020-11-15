import React from 'react';
import { style } from 'typestyle';
import { Card, Deck, generateDeck, generateHands, shuffleDeck } from '../util/generate';
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
  currentPlayer: number;
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
    };
  }

  render(): React.ReactNode {
    return (
      <div className={appStyle}>
        <DebugDeck hands={this.state.hands} />

        <PlayerHand
          player={this.state.currentPlayer}
          hand={this.state.hands[this.state.currentPlayer]}
          playCard={(card: Card) => {
            console.log(card);
          }}
        />
      </div>
    );
  }
}

export default App;
