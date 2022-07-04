import { cbFunction, pool } from "../HandlersRouter"

export function unblockContactHandler({ owner, contact }: { owner: string, contact: string }, unblockContactCallback: cbFunction): void {
    pool.query(`DELETE FROM blockedContacts USING users WHERE owner = (SELECT id FROM users WHERE username = '${owner}') AND contact = (SELECT id FROM users WHERE username = '${contact}')`, (error, unblock_contact_result) => { // check if user exists
        if (error) {
            unblockContactCallback(500, { error: 'Error while unblocking a contact' })
        } else {
            unblockContactCallback(200, { unblockedContact: contact })
        }
    })
}