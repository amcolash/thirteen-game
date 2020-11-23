/// <reference types="react-scripts" />

export interface Room {
  id: string;
  name: string;
  password: string;
  owner: string;
  members: string[];
}
