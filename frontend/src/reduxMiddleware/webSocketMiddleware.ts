import { Middleware } from 'redux'
import { handleReceivedNewMessage, handleReceivedOpenChat } from '../features/chatFeatures/chatStateSlice'
import { userLogout } from '../features/userInfoFeatures/userInfoStateSlice'
import socket from '../webSocketsUtil/webSocketServer'



const webSocketMiddleware: Middleware = (store) => {

    console.log(socket.listeners('message').length)

    return next => action => {
        if (store.getState().userInfo.userInfo.user_id && socket.listeners("message").length < 1) {
            socket.on('message', ({ sender, message, time }) => {
                console.log(`I'm recieving as ${socket.id} a message from ${sender}: ${message} -- Time: ${time}`)

                console.log(store.getState().chatsSlice.openChat)
                if (store.getState().chatsSlice.openChat.username !== sender) {
                    console.log('sending to new chat')
                    store.dispatch(handleReceivedOpenChat({ sender, message, time }))
                } else {
                    console.log('sending to existing chat')
                    store.dispatch(handleReceivedNewMessage({ sender, message, time }))
                }
            })

            socket.on('connect_error', (error) => {
                if (error.message === 'invalid_token') {
                    console.log('there was an error connecting to websockets server with your token')
                    store.dispatch(userLogout())
                }
            })
        }

        console.log(socket.listeners('message').length)
        next(action)
    }
}


export default webSocketMiddleware