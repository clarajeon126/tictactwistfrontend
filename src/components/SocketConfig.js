import io from 'socket.io-client';
const socket = io('https://tic-tac-twist-server-00562c5cd23f.herokuapp.com/');

export default socket;