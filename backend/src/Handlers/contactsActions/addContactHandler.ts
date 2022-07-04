import { QueryResult } from "pg"
import { cbFunction, pool } from "../HandlersRouter"

export function addContactHandler({owner, contact}: {owner: string, contact: string}, addContactCallback: cbFunction): void {
    pool.query(`INSERT INTO addedContacts (owner, contact) values ('${owner}', '${contact}') RETURNING contact`, (error, add_contact_result) => { // check if user exists
        if (error) {
            addContactCallback(500, { error: 'Error while adding a contact' })
        } else {
            console.log('added contact result', add_contact_result)
            addContactCallback(200, { addedContact: add_contact_result.rows[0].contact })
        }
    })
}