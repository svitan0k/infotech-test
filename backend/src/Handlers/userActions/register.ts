import { dataObj } from "../.."
import { Helpers } from "../../Helpers"
import { cbFunction, pool } from "../HandlersRouter"
import { createToken } from "../tokenActions/createToken"
import { writeDBToken } from "../tokenActions/writeDBToken"
import { searchUser } from "./searchUser"

export function registerHandler(registerData: dataObj, registerCallback: cbFunction): void {

    const acceptMethods: string[] = ['post']

    if (acceptMethods.indexOf(registerData.method.toLowerCase()) > -1) {
        // validating request input
        const username = typeof (registerData.payload.username) === 'string' ? registerData.payload.username : false
        const password = typeof (registerData.payload.password) === 'string' ? registerData.payload.password : false
        const role = typeof (registerData.payload.role) === 'string' ? registerData.payload.role : false

        const hashedPassword = Helpers.hash(password) // hashing user password here

        if (username && role && hashedPassword) {
            searchUser(username).then((result) => { // check for existing usernames in DB
                if (result && 'rows' in result && result.rows.length > 0) { // "if user with such username already exists"
                    registerCallback(409, { error: "User already exists" })
                } else { // otherwise, create a new user:
                    pool.query(`INSERT INTO users (username, role, password) VALUES ('${username}', '${role}', '${hashedPassword}') RETURNING id, username`, (error, result) => {
                        if (error) {
                            registerCallback(500, { error: error })
                        } else {
                            const newToken = createToken(result.rows[0].id, result.rows[0].username, result.rows[0].role)
                            if (typeof (newToken) === 'object') {
                                writeDBToken(newToken)
                                registerCallback(200, { result: newToken })
                            } else {
                                registerCallback(500, {error: "Error while generating access token"})
                            }
                        }
                    })
                }
            }).catch((error) => {
                registerCallback(500, { error: "Error while searching for users" })
            })
        } else {
            registerCallback(400, { error: "Provide the needed info" })
        }
    } else {
        registerCallback(405)
    }
}