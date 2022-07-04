import * as crypto from 'crypto'
import { currentEnv } from './config'


abstract class HelpersTS {
    constructor() { }

    abstract convertJsonToObj(buffer: string): object
    abstract hash(string: string): (string | boolean)
    abstract createRandomToken(stringLength: number): (string | boolean)
    abstract convertToMorseCode(message: string, isSyncOperation: boolean): Promise<string> | string
    abstract decryptMorseCode(message: string): Promise<string>
}


class HelpersClass extends HelpersTS {
    constructor() {
        super()
    }

    morseCode: { [key: string]: string } = {
        "A": ".-",
        "B": "-...",
        "C": "-.-.",
        "D": "-..",
        "E": ".",
        "F": "..-.",
        "G": "--.",
        "H": "....",
        "I": "..",
        "J": ".---",
        "K": "-.-",
        "L": ".-..",
        "M": "--",
        "N": "-.",
        "O": "---",
        "P": ".--.",
        "Q": "--.-",
        "R": ".-.",
        "S": "...",
        "T": "-",
        "U": "..-",
        "V": "...-",
        "W": ".--",
        "X": "-..-",
        "Y": "-.--",
        "Z": "--..",
        " ": `\xa0\xa0\xa0`,
        "0": "-----",
        "1": ".----",
        "2": "..---",
        "3": "...--",
        "4": "....-",
        "5": ".....",
        "6": "-....",
        "7": "--...",
        "8": "---..",
        "9": "----.",
        ".": ".-.-.-",
        ",": "--..--",
        "?": "..--..",
        "'": ".----.",
        "!": "-.-.--",
        "/": "-..-.",
        "(": "-.--.",
        ")": "-.--.-",
        "&": ".-...",
        ":": "---...",
        ";": "-.-.-.",
        "=": "-...-",
        "+": ".-.-.",
        "-": "-....-",
        "_": "..--.-",
        "\"": ".-..-.",
        "$": "...-..-",
        "@": ".--.-.",
    }

    convertToMorseCode(message: string, isSyncOperation: boolean): Promise<string> | string {
        if (isSyncOperation) {
            return message.toUpperCase().split(' ').map((word) => word.split('').map((symbol) => {
                return this.morseCode[symbol] ? this.morseCode[symbol] : symbol
            }).join(' ')).join("   ")
        } else {
            return new Promise((resolve) => {
                resolve(message.toUpperCase().split(' ').map((word) => word.split('').map((symbol) => {
                    return this.morseCode[symbol] ? this.morseCode[symbol] : symbol
                }).join(' ')).join("   "))
            })
        }
    }


    decryptMorseCode(message: string): Promise<string> {
        return new Promise((resolve) => {
            resolve(message.split('   ').map((word) => word.split(' ').map((symbol) => {
                return Object.keys(this.morseCode).find((key) => this.morseCode[key] === symbol)
            }).join('')).join(' '))
        })
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