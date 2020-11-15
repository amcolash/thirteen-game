import React from 'react';
import { style } from 'typestyle';
import { Card } from '../util/generate';
import PlayerCard from './PlayerCard';

const handStlying = style({
  display: 'flex',
  alignItems: 'center',
  padding: 30,
  borderRadius: 10,
  background: 'rgba(255,255,255,0.35)',
  maxWidth: '80vw',
});

interface PlayerHandProps {
  hand: Card[];
  player: number;
  playCard: (card: Card) => void;
}

export default function PlayerHand(props: PlayerHandProps) {
  return (
    <div style={{ paddingTop: 20, textAlign: 'center' }}>
      <h2>Player {props.player + 1} Hand</h2>
      <div className={handStlying}>
        {props.hand.map((card: Card, index) => (
          <PlayerCard card={card} index={index} key={index} playCard={props.playCard} />
        ))}
      </div>
    </div>
  );
}
