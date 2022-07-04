import { io, Socket } from 'socket.io-client'

const serverURL: string = "http://localhost:3003"
const socket: Socket = io(serverURL, { autoConnect: false })

// for debug only
// socket.onAny((event: Event, ...args) => {
//     console.log(event, args);
// });

// socket.on("connect", () => {
//     console.log(socket.connected, socket.id);
// });

export default socket