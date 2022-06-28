import http, { IncomingMessage, ServerResponse } from 'http'
import { StringDecoder } from 'string_decoder'
import { currentEnv } from './config'
import { Handlers } from './Handlers/HandlersRouter'
import { Helpers } from './Helpers'
import * as nodeStatic from 'node-static'
import os from 'os'


// defining threadpool size
process.env.UV_THREADPOOL_SIZE = os.cpus().length.toString()

// For serving static files
const staticServer = new nodeStatic.Server('./public')


export interface dataObj {
    [key: string]: any,
}



http.createServer((req:IncomingMessage, res: ServerResponse) => {
    Server(req, res)
}).listen(currentEnv.port, () => {
    console.log(`Listening on port ${currentEnv.port}`)
})



const Server = (req: IncomingMessage, res: ServerResponse) => {

    // req.addListener('end', () => {
    //     staticServer.serve(req, res)
    // }).resume()

    const basePath = `http:${req.headers.host}`
    const requestURL = new URL(req.url!, basePath)
    const requestPathname = requestURL.pathname.replace(/^\/+|\/+$/g, '')
    const method = req.method
    const headers = req.headers
    const queryParams = requestURL.searchParams

    const decoder = new StringDecoder('utf-8')

    let buffer = ''

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

        const chosenHandler = typeof (router[requestPathname]) !== 'undefined' ? router[requestPathname] : Handlers.notfound


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


const router: {[key:string]: Function} = {
    'api/register': Handlers.register,
    'api/login': Handlers.login,
}