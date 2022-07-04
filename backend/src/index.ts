import http, { IncomingMessage, ServerResponse } from 'http'
import { StringDecoder } from 'string_decoder'
import { currentEnv } from './config'
import { Handlers } from './Handlers/HandlersRouter'
import { Helpers } from './Helpers'
import { serveFile } from './Handlers/fileServeAction/serveFile'
import os from 'os'
import * as io from 'socket.io'
import { validateUser } from './websocketUtils/users'
import { formattedMessage } from './websocketUtils/messages'

// defining threadpool size
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()

export interface dataObj {
    [key: string]: any,
}

// http servers
http.createServer((req: IncomingMessage, res: ServerResponse) => {
    Server(req, res)
}).listen(currentEnv.httpPort, () => {
})


const Server = (req: IncomingMessage, res: ServerResponse) => {
    try {
        const basePath = `http:${req.headers.host}`
        const requestURL = new URL(req.url!, basePath)
        const requestPathname = requestURL.pathname.replace(/^\/+|\/+$/g, '')
        const method = req.method
        const headers = req.headers
        const queryParams = requestURL.searchParams

        const decoder = new StringDecoder('utf-8')

        let buffer = ''


        if (requestURL.pathname.split('/')[1] !== 'api') {
            serveFile(requestURL.pathname, '../../frontend/build/', req, res)
        } else {
            req.on('data', (chunk) => {
                buffer += decoder.write(chunk)
            })

            req.on('end', () => {
                buffer += decoder.end()

                const dataObj: dataObj = {
                    headers: headers,
                    method: method,
                    queryParams: queryParams,
                    payload: Helpers.convertJsonToObj(buffer)
                }

                const chosenHandler = typeof (apiRouter[requestPathname]) !== 'undefined' ? apiRouter[requestPathname] : Handlers.notfound


                chosenHandler(dataObj, (statusCode: number, payload: dataObj) => {

                    payload = typeof (payload) === 'object' ? payload : {}

                    const payloadString: string = JSON.stringify(payload)

                    res.writeHead(statusCode, {
                        'Content-type': 'application/json'
                    })
                    res.end(payloadString)
                })
            })
        }
    } catch (error) {
        res.writeHead(500)
        res.end()
    }
}


const apiRouter: { [key: string]: Function } = {
    'api/users/register': Handlers.register,
    'api/users/login': Handlers.login,
    'api/chat/decryptMessage': Handlers.decryptMessage,
    'api/chat/checkBlock': Handlers.checkBlockedUsers,
    'api/contacts/get': Handlers.getContacts,
    'api/contacts/add': Handlers.addContact,
    'api/contacts/remove': Handlers.removeContact,
    'api/contacts/block': Handlers.blockContact,
    'api/contacts/unblock': Handlers.unblockContact,
}







// websocket servers

interface newMessageProps {
    recipient: string,
    message: string,
}

const socketServer = new io.Server(currentEnv.webSocketPort as number, {
    cors: { origin: "http://localhost:3000", }
})


// connection validation - makes sure that only registered and logged in users are able to send messages
socketServer.use(async (socket, next) => {

    const username = socket.handshake.auth.client.username
    const client_id = socket.handshake.auth.client.user_id
    const token = socket.handshake.auth.client.token

    const isUserValid = await validateUser(token)

    if (!isUserValid) {
        return next(new Error('invalid_token'))
    } else {
        /// @ts-ignore -- TS notes that "username" prop doesn't exist on internal library type, couldn't fix by extending that type with a new interface with that prop and assigning it to the "socket" prop above, don't feel like this type should be given time to be properly typed, so I'm ignoring it.
        socket.username = username // I might not need this
        // addUserConnection(socket.id)
        next()
    }
})


socketServer.on('connection', async (socket) => {
    /// @ts-ignore
    socket.client_id = socket.handshake.auth.client.user_id
    /// @ts-ignore
    socket.username = socket.handshake.auth.client.username
    /// @ts-ignore
    const token = socket.handshake.auth.client.token // this isn't really needed
    /// @ts-ignore

    for (let [id, socket]  of socketServer.of('/').sockets) {
    } // remove the above later

    // if token was validated
    socket.on('send-new-open-message', ({ recipient, message }: newMessageProps) => {
        // const connectionObj: userObj = {
        //     socketId: socket.id,
        //     sender: sender,
        //     recipient: recipient,
        // }

        // const user = connectUsers(connectionObj)

        // join the chat with that specific user(verify the the sender isnot blocked by the recipient)
        // socket.join(user.room)


        // socket.to(user.room).emit('send-message', formattedMessage(sender, message))
        for (let [id, currentConnection]  of socketServer.of('/').sockets) {
            if (currentConnection.username === recipient) { // if no user is found in the sockets list, return an error saying that "user is currenctly offline and will not recieve your message(beacuse we do not store messages in db)"
                // if the recipient is not blocking this sender
                socket.to(currentConnection.id).emit('message', formattedMessage(socket.username, message, true))
            }
        }    
    })

    socket.on('send-new-message', ({recipient, message}: newMessageProps) => {
        for (let [id, currentConnection]  of socketServer.of('/').sockets) {
            if (currentConnection.username === recipient) { // if no user is found in the sockets list, return an error saying that "user is currenctly offline and will not recieve your message(beacuse we do not store messages in db)"
                // if the recipient is not blocking this sender
                socket.to(currentConnection.id).emit('message', formattedMessage(socket.username, message, false))
            }
        }   
    })

    // socket.on('receive-new-message', () => )



    // socket.on('send-message', (message) => {
    // })
})



// on connection:
// for (let [id, socket] of socketServer.of('/').sockets) {
//     users.push({
//         userId: id,
//         /// @ts-ignore -- same reason as below
//         username: socket.username,
//     })
// }