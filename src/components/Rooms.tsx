import { FirebaseDatabaseNode } from '@react-firebase/database';
import firebase from 'firebase/app';
import 'firebase/database';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Game from './Game';

export interface Room {
  id: string;
  name: string;
  password: string;
  owner: string;
  members: string[];
}

interface RoomsState {
  currentRoom?: string;
  roomName: string;
}

const roomPath = '/rooms';
const userPath = `/users`;

export default class Rooms extends React.Component<{}, RoomsState> {
  state = { roomName: '', currentRoom: undefined };

  user = firebase.auth().currentUser;

  componentDidMount() {
    if (this.user) {
      const userRef = firebase.database().ref(userPath).child(this.user.uid);

      userRef.update({ email: this.user.email, id: this.user.uid });
      userRef.get().then((v) => {
        const value = v.val();
        if (value !== null) this.setState({ currentRoom: value.currentRoom });
      });
    }
  }

  newRoom = () => {
    if (this.state.roomName.length > 0 && this.user) {
      const room: Room = { id: uuidv4(), name: this.state.roomName, password: '', owner: this.user.uid, members: [this.user.uid] };
      firebase
        .database()
        .ref(roomPath)
        .child(room.id)
        .set(room)
        .then(() => this.setState({ roomName: '' }));
      this.setRoom(room);
    }
  };

  leaveRoom = (newRoom?: Room) => {
    // Remove user from old room and optionally delete it if there are no more users in the room
    if (this.state.currentRoom) {
      const roomRef = firebase.database().ref(roomPath).child(this.state.currentRoom!);
      roomRef.get().then((v) => {
        const value = v.val();
        if (value !== null && value.members.length === 1) {
          roomRef.remove();
        } else if (value !== null) {
          roomRef.update({ members: value.members.filter((m: string) => m !== this.user!.uid) });
        }
      });
    }

    if (this.user) {
      firebase
        .database()
        .ref(userPath)
        .child(this.user.uid)
        .update({ currentRoom: newRoom ? newRoom.id : null })
        .then(() => this.setState({ currentRoom: newRoom ? newRoom.id : undefined }));
    }
  };

  setRoom = (room: Room) => {
    if (room.id !== this.state.currentRoom) this.leaveRoom(room);
  };

  render() {
    return this.state.currentRoom ? (
      <Game currentRoom={this.state.currentRoom!} leaveRoom={this.leaveRoom} />
    ) : (
      <div>
        <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => firebase.auth().signOut()}>
          Sign Out
        </button>
        <h1>Rooms</h1>
        <div>
          <div style={{ marginBottom: 20 }}>
            <FirebaseDatabaseNode path={roomPath} limitToLast={10}>
              {(d) => {
                if (d.isLoading) return <div>Loading...</div>;
                else if (d && d.value !== null)
                  return (
                    <div>
                      {(Object.values(d.value) as Room[]).map((room: Room) => (
                        <div key={room.id} onClick={() => this.setRoom(room)}>
                          {room.name}
                        </div>
                      ))}
                    </div>
                  );
                else return <div>No Availible Rooms</div>;
              }}
            </FirebaseDatabaseNode>
          </div>
          <input
            type="text"
            placeholder="Room Name"
            value={this.state.roomName}
            onChange={(e) => this.setState({ roomName: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') this.newRoom();
            }}
          />
          <button onClick={this.newRoom}>New Room</button>
        </div>
      </div>
    );
  }
}
