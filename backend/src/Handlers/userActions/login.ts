import { QueryResult } from "pg"
import { dataObj } from "../.."
import { Helpers } from "../../Helpers"
import { cbFunction, pool } from "../HandlersRouter"
import { checkToken } from "../tokenActions/checkToken"
import { createToken } from "../tokenActions/createToken"
import { updateToken } from "../tokenActions/updateToken"
import { writeDBToken } from "../tokenActions/writeDBToken"
import { searchUser } from "./searchUser"


// TODO
// Remove uneeded "error" in catch((error) => , where needed

export function loginHandler(loginData: dataObj, loginCallback: cbFunction): void {

    const acceptMethods: string[] = ['post']

    if (acceptMethods.indexOf(loginData.method.toLowerCase()) > -1) {

        // validating request input
        const username = typeof (loginData.payload.username) === 'string' ? loginData.payload.username : false
        const password = typeof (loginData.payload.password) === 'string' ? loginData.payload.password : false

        if (username && password) {
            searchUser(username).then((result) => { // check if user exists
                if ('rows' in result && result.rows.length > 0) { // "if existing user was found"
                    if (result.rows[0].password === Helpers.hash(password)) { // "if password for the user is correct"
                        const newToken = createToken(result.rows[0].id) // create new access token with 1 hour expiration time

                        checkToken(result.rows[0].id).then((result) => { // search for existing access token
                            if ('rows' in result && result.rows.length > 0) { // "if access token already exists, replace with a new one"
                                updateToken(newToken, (result) => {
                                    if (result) {
                                        loginCallback(200, { result: newToken })
                                    } else {
                                        loginCallback(500, { error: 'There was an error updating user token' })
                                    }
                                })
                            } else { // "access token doesn't exist, provide a new one"
                                writeDBToken(newToken).then((result) => {
                                    loginCallback(200, { result: newToken })
                                }).catch((error) => {
                                    loginCallback(500, { error: 'Failded while creating new token' })
                                })
                            }
                        }).catch((error) => {
                            loginCallback(500, { error: 'Failed while looking up the token' })
                        })
                    } else {
                        loginCallback(401, { error: 'invalid credentials' })
                    }
                } else {
                    loginCallback(404, { error: 'user does not exist' })
                }
            }).catch((error) => {
                loginCallback(400, { error: 'Provide all needed info' })
            })
        } else {
            loginCallback(405)
        }
    }
}