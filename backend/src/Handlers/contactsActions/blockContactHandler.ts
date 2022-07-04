import { QueryResult } from "pg"
import { cbFunction, pool } from "../HandlersRouter"

export function blockContactHandler({owner, contact}: {owner: string, contact: string}, blockContactCallback: cbFunction): void {
    pool.query(`INSERT INTO blockedContacts (owner, contact) values ('${owner}', '${contact}') RETURNING contact`, (error, block_contact_result) => { // check if user exists
        if (error) {
            blockContactCallback(500, { error: 'Error while blocking a contact' })
        } else {
            console.log('Blocked contact result', block_contact_result)
            blockContactCallback(200, { blockedContact: block_contact_result.rows[0].username })
        }
    })
}