import { cbFunction, pool } from "../HandlersRouter"

export function removeContactHandler({ owner, contact }: { owner: string, contact: string }, removeContactCallback: cbFunction): void {
    pool.query(`DELETE FROM addedContacts USING users WHERE owner = (SELECT id FROM users WHERE username = '${owner}') AND contact = (SELECT id FROM users WHERE username = '${contact}')`, (error, remove_contact_result) => {
        if (error) {
            removeContactCallback(500, { error: 'Error while removing a contact' })
        } else {
            removeContactCallback(200, { removedContact: contact })
        }
    })
}