import { QueryResult } from "pg"
import { pool } from "../HandlersRouter"
import { tokenObj } from "./createToken"

export function writeDBToken(newToken: tokenObj): Promise<Error | QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO tokens (user_ref_id, token, token_exp) VALUES ('${newToken.user_id}', '${newToken.tokenID}', '${newToken.expires}')`, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}