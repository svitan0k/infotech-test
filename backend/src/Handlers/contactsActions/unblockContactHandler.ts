import { QueryResult } from "pg"
import { cbFunction, pool } from "../HandlersRouter"

export function unblockContactHandler({owner, contact}: {owner: string, contact: string}, unblockContactCallback: cbFunction): void {
    pool.query(`SELECT * FROM users WHERE username = '${username}'`, (error, add_contact_result) => { // check if user exists
        if (error) {
            unblockContactCallback(500, { error: 'Error while blocking a contact' })
        } else {
            unblockContactCallback(200, { username: add_contact_result.rows[0].username, status: add_contact_result.rows[0].status })
        }
    })
}