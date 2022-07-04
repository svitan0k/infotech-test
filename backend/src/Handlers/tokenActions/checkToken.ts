import { QueryResult } from "pg";
import { pool } from "../HandlersRouter";


export function checkToken(user_id: string): Promise<Error | QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM tokens WHERE user_ref_id = ${user_id}`, (error, result) => {
            if (error) {
                reject(error)
            } else {
                resolve(result)
            }
        })
    })
}