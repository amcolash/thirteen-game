import React from 'react';
import { style } from 'typestyle';
import { Card, generateCardInfo, generateDeck, generateHand, shuffleDeck } from '../util/generate';
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

function App() {
  const deck = shuffleDeck(generateDeck());
  const hands: Card[][] = [];
  const numPlayers = 4;

  for (let i = 0; i < numPlayers; i++) {
    hands.push(generateHand(52 / numPlayers, deck));
  }

  return (
    <div className={appStyle}>
      <div style={{ display: 'flex', borderRadius: 10, background: 'rgba(255,255,255,0.35)' }}>
        {hands.map((hand, index) => (
          <div style={{ padding: 20 }}>
            <div>Player {index}</div>
            {hand.map((card: Card) => generateCardInfo(card, false, false, { justifyContent: 'center', padding: 2, textShadow: 'none' }))}
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1, maxHeight: '15vh' }} />

      <PlayerHand hand={hands[0]} />
    </div>
  );
}

export default App;
