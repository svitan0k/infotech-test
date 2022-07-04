import { createContext, useState } from "react"

interface ContextTS {
    children: React.ReactNode
}


// client-side morse converter
const morseCode: { [key: string]: string } = {
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

export function convertToMorseCode(message: string) {
    return message.toUpperCase().split(' ').map((word) => word.split('').map((symbol) => {
        return morseCode[symbol] ? morseCode[symbol] : symbol
    }).join(' ')).join("   ")
}


export function decryptMorseCode(message: string): string {
    return message.split('   ').map((word) => word.split(' ').map((symbol) => {
        return Object.keys(morseCode).find((key) => morseCode[key] === symbol)
    }).join('')).join(' ');
}


export const shareContext: React.Context<any> = createContext<ContextTS | null>(null)

const SharedContextWrapper: React.FC<ContextTS> = (props) => {

    const [passedUsername, setPassedUsername] = useState<string>('')

    return (
        <shareContext.Provider value={{
            passedUsername,
            setPassedUsername,
        }}>
            {props.children}
        </shareContext.Provider>
    )
}

export default SharedContextWrapper