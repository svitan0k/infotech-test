import http, { IncomingMessage, ServerResponse } from 'http'
import https from 'https'
import { StringDecoder } from 'string_decoder'
import { currentEnv } from './config'
import { Handlers } from './Handlers/HandlersRouter'
import { Helpers } from './Helpers'
import { serveFile } from './Handlers/fileServeAction/serveFile'
import os from 'os'
import * as io from 'socket.io'
import { validateUser } from './websocketUtils/users'
import { formattedMessage } from './websocketUtils/messages'
import { readFileSync } from 'fs'
import path from 'path'

// defining threadpool size
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()


export interface dataObj {
    [key: string]: any,
}

// http server
http.createServer((req: IncomingMessage, res: ServerResponse) => {
    Server(req, res)
}).listen(currentEnv.httpPort, () => {
    console.log(`HTTP: Listening on port ${currentEnv.httpPort}`)
})

// https server

const httpsOptions = {
    key: readFileSync(path.resolve('./dist/https/key.pem')),
    cert: readFileSync(path.resolve('./dist/https/cert.pem')),
}


https.createServer(httpsOptions, (req: IncomingMessage, res: ServerResponse) => {
    Server(req, res)
}).listen(currentEnv.httpsPort, () => {
    console.log(`HTTPS: Listening on port ${currentEnv.httpsPort}`)
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
    cors: { origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"] }
})


// connection validator middleware - makes sure that only registered and logged in users are able to send messages
socketServer.use(async (socket, next) => {

    const username = socket.handshake.auth.client.username
    // const client_id = socket.handshake.auth.client.user_id
    const token = socket.handshake.auth.client.token

    const isUserValid = await validateUser(token)

    if (!isUserValid) {
        return next(new Error('invalid_token'))
    } else {
        next()
    }
})


socketServer.on('connection', async (socket) => {
    /// @ts-ignore -- TS notes that "username" prop and other socket io library exposed functions doesn't exist on internal library type, couldn't fix by extending that type with a new interface with that prop and assigning it to the "socket" prop above, don't feel like this should be given time to be properly typed, so I'm ignoring it.
    socket.client_id = socket.handshake.auth.client.user_id
    /// @ts-ignore
    socket.username = socket.handshake.auth.client.username
    /// @ts-ignore

    // if token was validated
    socket.on('send-new-open-message', ({ recipient, message }: newMessageProps) => {

        for (let [id, currentConnection] of socketServer.of('/').sockets) {
            /// @ts-ignore
            if (currentConnection.username === recipient) {
                /// @ts-ignore
                socket.to(currentConnection.id).emit('message', formattedMessage(socket.username, message, true))
            }
        }
    })

    socket.on('send-new-message', ({ recipient, message }: newMessageProps) => {
        for (let [id, currentConnection] of socketServer.of('/').sockets) {
            /// @ts-ignore
            if (currentConnection.username === recipient) {
                /// @ts-ignore
                socket.to(currentConnection.id).emit('message', formattedMessage(socket.username, message, false))
            }
        }
    })
})