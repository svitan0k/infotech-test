import { QueryResult } from "pg"
import { cbFunction, pool } from "../HandlersRouter"

export function removeContactHandler({owner, contact}: {owner: string, contact: string}, removeContactCallback: cbFunction): void {
    pool.query(`SELECT * FROM users WHERE username = '${username}'`, (error, add_contact_result) => { // check if user exists
        if (error) {
            removeContactCallback(500, { error: 'Error while removing a contact' })
        } else {
            removeContactCallback(200, { username: add_contact_result.rows[0].username, status: add_contact_result.rows[0].status })
        }
    })
}