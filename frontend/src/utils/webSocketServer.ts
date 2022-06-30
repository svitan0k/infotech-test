import { io } from 'socket.io-client'

const serverURL:string = "http://localhost:3003"
const socket = io(serverURL, {autoConnect: false})

socket.onAny((event: Event, ...args) => {
	console.log(event, args);
});

export default socket