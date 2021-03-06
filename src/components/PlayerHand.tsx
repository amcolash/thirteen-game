import React from 'react';
import { style } from 'typestyle';

import { Card, Game, User } from '../util/data';
import { cardsWin } from '../util/logic';
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
  playCard: (card?: Card) => void;
}

const PlayerHand = (props: PlayerHandProps) => {
  const enabled = props.user.id === props.game.turn;
  const hand = props.game.hands[props.user.id];

  if (!hand) return null;

  return (
    <div style={{ paddingTop: 20, textAlign: 'center' }}>
      <div className={handStlying}>
        {hand.map((card: Card, index) => (
          <PlayerCard
            card={card}
            index={index}
            key={index}
            enabled={enabled && cardsWin([card], props.game.lastPlayed)}
            playCard={props.playCard}
          />
        ))}
      </div>
      <button onClick={() => props.playCard()} disabled={!enabled}>
        Skip Turn
      </button>
    </div>
  );
};

export default PlayerHand;
