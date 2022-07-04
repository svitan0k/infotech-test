import { cbFunction, pool } from "../HandlersRouter"

export function addContactHandler({ owner, contact }: { owner: string, contact: string }, addContactCallback: cbFunction): void {
    pool.query(`INSERT INTO addedContacts (owner, contact) SELECT t1.id, t2.id FROM users t1 JOIN users t2 ON t1.username = '${owner}' AND t2.username = '${contact}'`, (error, add_contact_result) => { // check if user exists
        if (error) {
            addContactCallback(500, { error: 'Error while adding a contact' })
        } else {
            addContactCallback(200, { addedContact: contact })
        }
    })
}