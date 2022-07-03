import { dataObj } from ".."
import { Pool } from 'pg'
import { currentEnv } from "../config"
import { Helpers } from "../Helpers"
import { registerHandler } from "./userActions/register"
import { loginHandler } from "./userActions/login"
import { decryptMessageHandler } from "./chatActions/decryptMessage"

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


    // Not found handler
    notfound(notFoundData: dataObj, notFoundCallback: cbFunction): void {
        notFoundCallback(404, {})
    }
}


export const Handlers = new HandlersClass()