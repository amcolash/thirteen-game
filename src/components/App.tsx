import React from 'react';
import { style } from 'typestyle';
import { Card, cardWins, Deck, generateCardInfo, generateDeck, generateHands, shuffleDeck, sortHand } from '../util/generate';
import DebugDeck from './DeckDebug';
import PlayerCard from './PlayerCard';
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
  lastCard?: Card;
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
        this.setState({ hands, playedCards, lastCard: card || this.state.lastCard, turn: (turn + 1) % this.state.numPlayers });
      },
      turn === this.state.currentPlayer || hands[turn].length === 0 ? 0 : 500
    );
  }

  chooseCard(hand: Card[], lastCard?: Card): Card | undefined {
    const sorted = sortHand(hand);

    if (!lastCard) return sorted[0];
    else {
      for (let i = 0; i < sorted.length; i++) {
        const card = sorted[i];
        if (cardWins(card, lastCard)) return card;
      }
    }
  }

  componentDidUpdate() {
    if (this.state.turn !== this.state.currentPlayer) {
      this.playCard(this.chooseCard(this.state.hands[this.state.turn], this.state.lastCard));
    } else {
      const sorted = sortHand(this.state.hands[this.state.currentPlayer]);
      let lost: boolean = true;
      for (let i = 0; i < sorted.length; i++) {
        const card = sorted[i];
        if (cardWins(card, this.state.lastCard)) lost = false;
      }
      if (lost) this.setState({ lastCard: undefined, turn: (this.state.turn + 1) % this.state.numPlayers });
    }
  }

  render(): React.ReactNode {
    return (
      <div className={appStyle}>
        <DebugDeck hands={this.state.hands} turn={this.state.turn} />

        <h2>Played Cards</h2>
        {this.state.lastCard && <PlayerCard card={this.state.lastCard} index={0} />}
        <div style={{ display: 'flex', maxWidth: '90vw', flexWrap: 'wrap' }}>
          {this.state.playedCards.map((card: Card) => generateCardInfo(card, false, false, { padding: 4 }))}
        </div>

        <PlayerHand
          player={this.state.currentPlayer}
          turn={this.state.turn}
          hand={this.state.hands[this.state.currentPlayer]}
          playCard={(card: Card) => {
            if (cardWins(card, this.state.lastCard)) this.playCard(card);
          }}
        />
      </div>
    );
  }
}

export default App;
