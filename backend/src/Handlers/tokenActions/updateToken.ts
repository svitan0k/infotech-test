import { pool } from "../HandlersRouter"
import { tokenObj } from "./createToken"

export function updateToken(newToken: tokenObj, callback: (update_result: boolean) => void) {
    pool.query(`UPDATE tokens SET token = '${newToken.tokenID}', token_exp = '${newToken.expires}' WHERE user_ref_id = '${newToken.user_id}'`, (error, result) => {
        if (error) {
            callback(false)
        } else {
            callback(true)
        }
    })
}