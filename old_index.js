const os = require('os')
process.env.UV_THREADPOOL_SIZE = os.cpus().length // do not go beyond the max amount of logical cors on the system; otherwise, the context time for threads(which are handled by scheduler) is going to slow down the performance
const http = require('http')
const bcrypt = require('bcrypt')


http.createServer((req, res) => {
    bcrypt.hash('somevaltohash', 2).then((hash) => {
        res.writeHead(200, {'Content-type': 'text/plain'})
        res.write(hash)
        res.end()
    })
}).listen(3000, () => {
    console.log('Listening on port 3000')
})