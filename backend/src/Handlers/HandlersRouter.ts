import { dataObj } from ".."
import { Pool } from 'pg'
import { currentEnv } from "../config"
import { registerHandler } from "./userActions/register"
import { loginHandler } from "./userActions/login"
import { decryptMessageHandler } from "./chatActions/decryptMessage"
import { addContactHandler } from "./contactsActions/addContactHandler"
import { removeContactHandler } from "./contactsActions/removeContactHandler"
import { blockContactHandler } from "./contactsActions/blockContactHandler"
import { unblockContactHandler } from "./contactsActions/unblockContactHandler"
import { getContactsHandler } from "./contactsActions/getContactsHandler"
import { checkBlockedStatus } from "../websocketUtils/users"



export type cbFunction = (statusCode: number, data?: object) => void

export const pool = new Pool({ // credentials for db connection
    user: currentEnv.user as string | undefined,
    host: currentEnv.host as string | undefined,
    database: currentEnv.database as string | undefined,
    password: currentEnv.dbPassword as string | undefined,
    port: currentEnv.dbPort as number | undefined,
})


abstract class HandlersTS {
    constructor() { }

    // Working with users
    abstract register(registerData: dataObj, callback: cbFunction): void
    abstract login(loginData: dataObj, loginCallback: cbFunction): void

    // chat
    abstract decryptMessage(message: dataObj, decryptMessageCallback: cbFunction): void

    // contacts
    abstract getContacts(usernames: dataObj, getContactsCallback: cbFunction): void
    abstract addContact(usernames: dataObj, addContactCallback: cbFunction): void
    abstract removeContact(usernames: dataObj, removeContactCallback: cbFunction): void
    abstract blockContact(usernames: dataObj, blockContactCallback: cbFunction): void
    abstract unblockContact(usernames: dataObj, unblockContactCallback: cbFunction): void
    abstract checkBlockedUsers(usernmaes: dataObj, checkBlockedUsersCallback: cbFunction): void

    // request - not found 
    abstract notfound(notFoundData: dataObj, callback: cbFunction): void
}


class HandlersClass extends HandlersTS {
    constructor() {
        super()
    }

    // User routes handlers
    register(registerData: dataObj, callback: cbFunction): void {
        registerHandler(registerData, callback)
    }

    login(loginData: dataObj, loginCallback: cbFunction): void {
        loginHandler(loginData, loginCallback)
    }


    // chat routes handlers
    decryptMessage(message: dataObj, decryptMessageCallback: cbFunction): void {
        decryptMessageHandler(message.payload.message, decryptMessageCallback)
    }

    checkBlockedUsers(usernames: dataObj, checkBlockedUsersCallback: cbFunction): void {
        checkBlockedStatus({ sender: usernames.queryParams.get('sender'), recipient: usernames.queryParams.get('recipient') }, checkBlockedUsersCallback)
    }


    // contact handlers
    getContacts(usernames: dataObj, getContactsCallback: cbFunction): void {
        getContactsHandler(usernames.queryParams.get('owner'), getContactsCallback)
    }

    addContact(usernames: dataObj, addContactCallback: cbFunction): void {
        addContactHandler(usernames.payload, addContactCallback)
    }

    removeContact(usernames: dataObj, removeContactCallback: cbFunction): void {
        removeContactHandler({ owner: usernames.queryParams.get('owner'), contact: usernames.queryParams.get('contact') }, removeContactCallback)
    }

    blockContact(usernames: dataObj, blockContactCallback: cbFunction): void {
        blockContactHandler(usernames.payload, blockContactCallback)
    }

    unblockContact(usernames: dataObj, unblockContactCallback: cbFunction): void {
        unblockContactHandler(usernames.payload, unblockContactCallback)
    }


    // Not found handler
    notfound(notFoundData: dataObj, notFoundCallback: cbFunction): void {
        notFoundCallback(404, {error: "404 - Resourse wasn't found"})
    }
}


export const Handlers = new HandlersClass()