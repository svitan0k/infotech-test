import { Helpers } from "../../Helpers"

export interface tokenObj {
    user_id: string,
    username: string,
    tokenID: string | boolean,
    role: string,
    expires: string,
}

export function createToken(user_id: string, username: string, role: string): tokenObj | boolean {
    const tokenID = Helpers.createRandomToken(20)

    if (tokenID) {
        let tokenExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000) // one hour expiration period

        const tokenObj: tokenObj = {
            user_id: user_id,
            username: username,
            tokenID: tokenID,
            role: role,
            expires: tokenExpiration.toUTCString(),
        }
        return tokenObj
    } else {
        return false
    }
}