import { dataObj } from ".."
import { Pool } from 'pg'
import { currentEnv } from "../config"
import { Helpers } from "../Helpers"
import { registerHandler } from "./userActions/register"
import { loginHandler } from "./userActions/login"
import { decryptMessageHandler } from "./chatActions/decryptMessage"
import { addContactHandler } from "./contactsActions/addContactHandler"
import { removeContactHandler } from "./contactsActions/removeContactHandler"
import { blockContactHandler } from "./contactsActions/blockContactHandler"
import { unblockContactHandler } from "./contactsActions/unblockContactHandler"

// TODO
// Customize all the error handling (right now it just returns {error: error})
// Check all the status code on all callbacks



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
    abstract addContact(username: dataObj, addContactCallback: cbFunction): void
    abstract removeContact(username: dataObj, removeContactCallback: cbFunction): void
    abstract blockContact(username: dataObj, blockContactCallback: cbFunction): void

    // Request not found 
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


    // contact handlers
    addContact(usernames: dataObj, addContactCallback: cbFunction): void {
        addContactHandler(usernames.payload, addContactCallback)
    }

    removeContact(usernames: dataObj, removeContactCallback: cbFunction): void {
        removeContactHandler(usernames.payload, removeContactCallback)
    }

    blockContact(usernames: dataObj, blockContactCallback: cbFunction): void {
        blockContactHandler(usernames.payload, blockContactCallback)
    }

    unblockContact(usernames: dataObj, unblockContactCallback: cbFunction): void {
        unblockContactHandler(usernames.payload, unblockContactCallback)
    }


    // Not found handler
    notfound(notFoundData: dataObj, notFoundCallback: cbFunction): void {
        notFoundCallback(404, {})
    }
}


export const Handlers = new HandlersClass()