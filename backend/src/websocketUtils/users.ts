import { pool } from "../Handlers/HandlersRouter"
import moment from 'moment'


export type userObj = {
    socketId: string,
    sender: string,
    recipient: string,
}

type usersArray<T> = Array<T>

const users: usersArray<userObj> = []

// export const connectUsers = ({socketId, sender, recipient}: userObj): userObj => {
//     // if username is the same as before don't create a new connection but use the old one instead
//     console.log('From inside "connectUsers":', socketId, sender, recipient)

//     const user = {socketId, sender, recipient}
//     users.push({socketId, sender, recipient})
//     return user
// }

export const validateUser = (client_id: string, token: string): Promise<Error | boolean> => {
    return new Promise((resolve, reject) => {
        console.log('this is token id', token)
        pool.query(`SELECT token_exp FROM tokens WHERE token = '${token}'`, (error, token_search_result) => { // check if token was found
            if (error) {
                reject(error)
            } else {
                if (token_search_result.rowCount > 0) {
                    if (moment(token_search_result.rows[0].token_exp).format() < moment().subtract(1, 'hour').format()) { // check if token has expired
                        console.log("token is ", false)
                        resolve(false)
                    } else {
                        console.log("token is ", true)
                        resolve(true)
                    }
                } else { // no token was found for the user
                    console.log("NO TOKEN ", true)
                    resolve(false)
                }
            }
        })
    })
}

export const addUserConnection = (socketId: string) => {
    users.push()
}