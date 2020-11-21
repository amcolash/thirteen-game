import React from 'react';
import { style } from 'typestyle';
import { Card, generateCardInfo } from '../util/generate';

interface DebugDeckProps {
  hands: Card[][];
  turn: number;
}

const currentStyle = style({ fontWeight: 'bold', color: 'red', fontSize: 14 });

export default function DeckDebug(props: DebugDeckProps) {
  return (
    <React.Fragment>
      <h2>{props.turn === -1 ? 'Round Over' : `Player ${props.turn + 1} Turn`}</h2>
      <div style={{ display: 'flex', borderRadius: 10, background: 'rgba(255,255,255,0.35)' }}>
        {props.hands.map((hand, index) => {
          return (
            <div style={{ padding: 20 }} key={index}>
              <div className={props.turn === index ? currentStyle : undefined} style={{ marginBottom: 10 }}>
                Player {index + 1}
              </div>
              {hand.map((card: Card) => generateCardInfo(card, false, false, { justifyContent: 'center', padding: 2, textShadow: 'none' }))}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}
