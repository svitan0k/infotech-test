import { useState } from "react"
import { createContext } from "react"

interface ContextTS {
    children: React.ReactNode
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