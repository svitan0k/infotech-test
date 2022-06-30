import http, { IncomingMessage, ServerResponse } from 'http'
import { StringDecoder } from 'string_decoder'
import { currentEnv } from './config'
import { Handlers } from './Handlers/HandlersRouter'
import { Helpers } from './Helpers'
import { serveFile } from './Handlers/fileServeAction/serveFile'
import os from 'os'
import * as io from 'socket.io'

// defining threadpool size
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()

export interface dataObj {
    [key: string]: any,
}

// http servers
http.createServer((req: IncomingMessage, res: ServerResponse) => {
    Server(req, res)
}).listen(currentEnv.httpPort, () => {
    console.log(`Listening on port ${currentEnv.httpPort}`)
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

        // console.log("And here is a pathname:", requestURL.pathname, "and ", req.url, 'also ', requestURL.pathname.split('/')[1])

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
}




// websocket servers
// const socketServer = new io.Server(currentEnv.webSocketPort as number, {
//     cors: {origin: "http://localhost:3000",}
// })

// socketServer.on('connection', (socket) => {
//     socket.on('send-message', (message) => {
//         console.log('sd')
//     })
// })