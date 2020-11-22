import { FirebaseDatabaseNode } from '@react-firebase/database';
import firebase from 'firebase/app';
import 'firebase/database';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Room {
  name: string;
  id: string;
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
      firebase
        .database()
        .ref(userPath)
        .child(this.user.uid)
        .get()
        .then((v) => {
          const value = v.val();
          if (value !== null) this.setState({ currentRoom: value.currentRoom });
        });
    }
  }

  newRoom = () => {
    if (this.state.roomName.length > 0 && this.user) {
      const room: Room = { name: this.state.roomName, id: uuidv4(), owner: this.user.uid, members: [this.user.uid] };
      firebase
        .database()
        .ref(roomPath)
        .child(room.id)
        .set(room)
        .then(() => this.setState({ roomName: '' }));
      this.setRoom(room);
    }
  };

  setRoom = (room: Room) => {
    if (this.user && room.id !== this.state.currentRoom) {
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

      firebase
        .database()
        .ref(userPath)
        .child(this.user.uid)
        .update({ currentRoom: room.id })
        .then(() => this.setState({ currentRoom: room.id }));
    }
  };

  render() {
    return (
      <div>
        <button style={{ position: 'absolute', top: 20, right: 20 }} onClick={() => firebase.auth().signOut()}>
          Sign Out
        </button>
        <h1>Rooms</h1>
        <div>Current Room: {this.state.currentRoom}</div>
        <div>
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
          <input
            type="text"
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
