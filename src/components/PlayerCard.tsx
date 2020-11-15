import React from 'react';
import Draggable from 'react-draggable';

import { style } from 'typestyle';
import { Card, generateCardInfo } from '../util/generate';

const size = 30;

const cardStlying = style({
  width: 2.5 * size,
  height: 3.5 * size,
  margin: 8,
  marginLeft: -2 * size,
  borderRadius: 10,
  position: 'relative',

  padding: 10,
  background: '#eee',
  border: '2px solid #bbb',
  textShadow: 'none',
  textAlign: 'center',

  transition: 'margin 0.25s',
  $nest: {
    '&:hover': {
      marginTop: -size * 1.25,
    },
  },
});

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

function lerpMulti(amt: number, values: number[]) {
  if (values.length === 1) return values[0];
  const cunit = 1.0 / (values.length - 1);
  return lerp(values[Math.floor(amt / cunit)], values[Math.ceil(amt / cunit)], (amt % cunit) / cunit);
}

interface PlayerCardProps {
  card: Card;
  index: number;
  playCard: (card: Card) => void;
}

export default function PlayerCard(props: PlayerCardProps) {
  return (
    <Draggable>
      {/*Draggable does not play nice with pre-styled transforms - thinking emoji...*/}
      <div
        className={cardStlying}
        style={{
          marginLeft: props.index === 0 ? 8 : undefined,
          // transform: `rotate(${lerp(-20, 20, props.index / 13)}deg) translateY(${lerpMulti(props.index / 13, [0, -20, -30, -20, 0]) + 10}px)`,
        }}
        onClick={() => props.playCard(props.card)}
      >
        <div style={{ position: 'absolute', top: size / 3, left: size / 3 }}>{generateCardInfo(props.card, true, true)}</div>
        <div style={{ position: 'absolute', bottom: size / 3, right: size / 3 }}>{generateCardInfo(props.card, true, false)}</div>
      </div>
    </Draggable>
  );
}
