import { readFile } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import path from "path";

export function serveFile(filePath: string, staticFolderPath: string, req: IncomingMessage, res: ServerResponse) {

    if (filePath === '/' || path.extname(filePath).toLocaleLowerCase() === '') {
        filePath = '/index.html'
    }
    
    const fileExtension: string = path.extname(filePath).toLocaleLowerCase()

    let fullPath = path.resolve(__dirname, '../../' + staticFolderPath + filePath)

    const mimeTypes: { [key: string]: string } = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType: string = mimeTypes[fileExtension] || 'application/octet-stream'

    readFile(fullPath, (error, result) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404) // might want to add something here
                res.end()
            } else {
                res.writeHead(500)
                res.end()
            }
        } else {
            res.writeHead(200, { 'Content-type': contentType })
            res.end(result, 'utf-8')
        }
    })
}