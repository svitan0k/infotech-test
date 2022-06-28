import { dataObj } from "../.."
import { Helpers } from "../../Helpers"

export interface tokenObj {
    user_id: string,
    tokenID: string | boolean,
    expires: string,
}

export function createToken(user_id: string): tokenObj {
    const tokenID = Helpers.createRandomToken(20)
    // one hour expiration period

    let tokenExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000)
    console.log('This is current date:', new Date(Date.now()).toUTCString())
    console.log('This is token expiration date:', tokenExpiration)

    const tokenObj: tokenObj = {
        user_id: user_id,
        tokenID: tokenID,
        expires: tokenExpiration.toUTCString(),
    }

    return tokenObj
}