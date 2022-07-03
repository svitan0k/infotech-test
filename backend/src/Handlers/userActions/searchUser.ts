import { QueryResult } from "pg";
import { pool } from "../HandlersRouter";


export function searchUser(username: string): Promise<Error | QueryResult<any>> {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM users WHERE username = '${username}'`, (error, search_user_result) => { // check if user exists
            if (error) {
                reject(error)
            } else {
                resolve(search_user_result)
            }
        })
    })
}