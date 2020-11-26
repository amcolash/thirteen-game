import React, { Suspense } from 'react';
import { Room } from '../util/data';
import FancyInput from './FancyInput';

interface RoomListProps {
  rooms: Room[];
  newRoom: (roomName: string) => void;
  changeRoom: (room: Room) => void;
}

const RoomList = (props: RoomListProps) => {
  return (
    <div>
      <h1>Rooms</h1>
      <div style={{ marginBottom: 20 }}>
        <Suspense fallback={<div>Loading Rooms</div>}>
          {props.rooms.length === 0 ? (
            <div>No Available Rooms</div>
          ) : (
            Object.values(props.rooms).map((room: Room) => {
              const members = room.members ? Object.values(room.members) : [];
              return (
                <div key={room.id} style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
                  <div>
                    {room.name}, Players: ({members.length} / 4)
                  </div>
                  <button onClick={() => props.changeRoom(room)} disabled={members.length > 3 || room.game !== undefined}>
                    Join
                  </button>
                </div>
              );
            })
          )}
        </Suspense>
      </div>
      <div style={{ display: 'flex' }}>
        <FancyInput
          placeholder="Room Name"
          buttonLabel="New Room"
          initialValue="test"
          onConfirm={(value: string) => props.newRoom(value)}
        />
      </div>
    </div>
  );
};

export default RoomList;
