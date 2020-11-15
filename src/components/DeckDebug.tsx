import React from 'react';
import { Card, generateCardInfo } from '../util/generate';

interface DebugDeckProps {
  hands: Card[][];
}

export default function DeckDebug(props: DebugDeckProps) {
  return (
    <React.Fragment>
      <h2>Hands</h2>
      <div style={{ display: 'flex', borderRadius: 10, background: 'rgba(255,255,255,0.35)' }}>
        {props.hands.map((hand, index) => (
          <div style={{ padding: 20 }} key={index}>
            <div>Player {index + 1}</div>
            {hand.map((card: Card) => generateCardInfo(card, false, false, { justifyContent: 'center', padding: 2, textShadow: 'none' }))}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}
