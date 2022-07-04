import { cbFunction, pool } from "../HandlersRouter"

export function blockContactHandler({ owner, contact }: { owner: string, contact: string }, blockContactCallback: cbFunction): void {
    pool.query(`INSERT INTO blockedContacts (owner, contact) SELECT t1.id, t2.id FROM users t1 JOIN users t2 ON t1.username = '${owner}' AND t2.username = '${contact}'`, (error, block_contact_result) => { // check if user exists
        if (error) {
            blockContactCallback(500, { error: 'Error while blocking a contact' })
        } else {
            blockContactCallback(200, { blockedContact: contact })
        }
    })
}