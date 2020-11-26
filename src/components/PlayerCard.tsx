import React from 'react';

import { style } from 'typestyle';
import { Card } from '../util/data';
import { generateCardInfo } from '../util/generate';

const size = 30;

const cardStlying = style({
  width: 2.5 * size,
  height: 3.5 * size,
  margin: 8,
  marginLeft: -2 * size,
  borderRadius: 10,
  position: 'relative',

  padding: 10,
  background: '#aaa',
  border: '2px solid #bbb',
  textShadow: 'none',
  textAlign: 'center',

  transition: 'margin 0.25s',
  $nest: {
    '&.enabled': {
      background: '#eee',

      $nest: {
        '&:hover': {
          marginTop: -size * 1.25,
        },
      },
    },
  },
});

interface PlayerCardProps {
  card: Card;
  index?: number;
  enabled?: boolean;
  normal?: boolean;
  playCard?: (card: Card) => void;
}

const PlayerCard = (props: PlayerCardProps) => {
  return (
    <div
      className={cardStlying + (props.enabled || props.normal ? ' enabled' : '')}
      style={{ marginLeft: props.index === 0 ? 0 : undefined }}
      onClick={() => {
        if (props.playCard) props.playCard(props.card);
      }}
    >
      <div style={{ position: 'absolute', top: size / 3, left: size / 3 }}>{generateCardInfo(props.card, true, true)}</div>
      <div style={{ position: 'absolute', bottom: size / 3, right: size / 3 }}>{generateCardInfo(props.card, true, false)}</div>
    </div>
  );
};

export default PlayerCard;
