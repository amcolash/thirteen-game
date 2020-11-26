import React from 'react';
import { style } from 'typestyle';
import { Card, Game, User } from '../util/data';
import { cardWins } from '../util/generate';
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
  game: Game;
  user: User;
  playCard: (card: Card) => void;
}

const PlayerHand = (props: PlayerHandProps) => {
  return (
    <div style={{ paddingTop: 20, textAlign: 'center' }}>
      <div className={handStlying}>
        {props.game.hands[props.user.id].map((card: Card, index) => (
          <PlayerCard
            card={card}
            index={index}
            key={index}
            enabled={props.user.id === props.game.turn && cardWins(card, props.game.lastCard)}
            playCard={props.playCard}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerHand;
