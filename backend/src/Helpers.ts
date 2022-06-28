import * as crypto from 'crypto'
import { currentEnv } from './config'


abstract class HelpersTS {
    constructor() { }

    abstract convertJsonToObj(buffer: string): object
    abstract hash(string: string): (string | boolean)
    abstract createRandomToken(stringLength: number): (string | boolean)
}


class HelpersClass extends HelpersTS {
    constructor() {
        super()
    }

    convertJsonToObj(buffer: string): object {
        try {
            const convertedBUffer = JSON.parse(buffer)
            return convertedBUffer
        } catch (error) {
            return { error }
        }
    }

    hash(string: string): (string | boolean) {
        if (typeof (string) === 'string' && string.trim().length > 0) {
            /// @ts-ignore
            const hashed = crypto.createHash('sha256', currentEnv.secretKey).update(string).digest('hex')
            return hashed
        } else {
            return false
        }
    }

    createRandomToken(stringLength: number): (string | boolean) {
        if (stringLength) {
            const possibleChar = 'abcdefghijklmnopqrstuvwxyz1234567890'

            let token = ''

            // Generrating random token here
            for (let i = 0; i < 20; i++) {
                token += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length))
            }

            return token
        } else {
            return false
        }
    }
}


export const Helpers = new HelpersClass()