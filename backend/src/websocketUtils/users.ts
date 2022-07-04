import { cbFunction, pool } from "../Handlers/HandlersRouter"
import moment from 'moment'


export type userObj = {
    socketId: string,
    sender: string,
    recipient: string,
}

export const validateUser = (token: string): Promise<Error | boolean> => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT token_exp FROM tokens WHERE token = '${token}'`, (error, token_search_result) => { // check if token was found
            if (error) {
                reject(error)
            } else {
                if (token_search_result.rowCount > 0) {
                    if (moment(token_search_result.rows[0].token_exp).format() < moment.utc().subtract(1, 'hour').format()) { // check if token has expired
                        resolve(false)
                    } else {
                        resolve(true)
                    }
                } else { // no token was found for the user
                    resolve(false)
                }
            }
        })
    })
}


export const checkBlockedStatus = ({ sender, recipient }: { sender: string, recipient: string }, checkBlockedStatusCallback: cbFunction): void => { // Checks if either of the users has the other blocked. If one does, the chat is blocked for both:
    pool.query(`SELECT username FROM users WHERE id = (SELECT contact FROM blockedContacts WHERE owner = (SELECT id FROM users WHERE username = '${recipient}')) UNION SELECT username FROM users WHERE id = (SELECT contact FROM blockedContacts WHERE owner = (SELECT id FROM users WHERE username = '${sender}'))`, (error, result) => { // ^^ terrific, but it works. 
        if (error) {
            return checkBlockedStatusCallback(500, { error: 'Error while looking up the recipient' })
        } else {
            if (result.rows.filter((blockedContact) => {
                if (blockedContact.username === sender || blockedContact.username === recipient) {
                    return blockedContact.username 
                } else {
                    return
                }
            }).length > 0) {
                return checkBlockedStatusCallback(200, { blocked: true }) // chat is blocked
            } else {
                return checkBlockedStatusCallback(200, { blocked: false }) // chat isn't blocked
            }
        }
    })
}