import { Middleware } from 'redux'
import { handleReceivedNewMessage, handleReceivedOpenChat } from '../features/chatFeatures/chatStateSlice'
import { userLogout } from '../features/userInfoFeatures/userInfoStateSlice'
import socket from '../webSocketsUtil/webSocketServer'



const webSocketMiddleware: Middleware = (store) => {


    return next => action => {
        if (store.getState().userInfo.userInfo.user_id && socket.listeners("message").length < 1) {
            socket.on('message', ({ sender, message, time }) => {

                if (store.getState().chatsSlice.openChat.username !== sender) {
                    store.dispatch(handleReceivedOpenChat({ sender, message, time }))
                } else {
                    store.dispatch(handleReceivedNewMessage({ sender, message, time }))
                }
            })

            socket.on('connect_error', (error) => {
                if (error.message === 'invalid_token') {
                    store.dispatch(userLogout())
                }
            })
        }

        next(action)
    }
}


export default webSocketMiddleware