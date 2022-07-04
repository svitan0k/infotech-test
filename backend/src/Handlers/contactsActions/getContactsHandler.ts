import { cbFunction, pool } from "../HandlersRouter"

export function getContactsHandler(owner: string, getContactsCallback: cbFunction): void {
    pool.query(`SELECT username FROM users INNER JOIN blockedContacts ON blockedContacts.contact = users.id WHERE blockedContacts.owner = (SELECT id FROM users WHERE username = '${owner}')`, (error, get_blocked_contacts_result) => {
        if (error) {
            getContactsCallback(500, { error: 'Error while getting blocked contacts' })
        } else {
            pool.query(`SELECT username FROM users INNER JOIN addedContacts ON addedContacts.contact = users.id WHERE addedContacts.owner = (SELECT id FROM users WHERE username = '${owner}') AND NOT username IN (SELECT username FROM users INNER JOIN blockedContacts ON blockedContacts.contact = users.id WHERE blockedContacts.owner = (SELECT id FROM users WHERE username = '${owner}')); `, (error, get_added_contacts_result) => {
                if (error) {
                    getContactsCallback(500, { error: 'Error while getting added contacts' })
                } else {
                    getContactsCallback(200, {
                        addedContacts: [...get_added_contacts_result.rows.map((username) => username.username)],
                        blockedContacts: [...get_blocked_contacts_result.rows.map((username) => username.username)],
                    })
                }
            })
        }
    })
}
