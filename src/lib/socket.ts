import { io } from 'socket.io-client';

export const socket = io('https://taskapp-stamurai-api.amiigo.in', {
  withCredentials: true,
  autoConnect: false
});