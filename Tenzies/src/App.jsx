import { useState } from "react"
import Die from "./Die"

export default function App() {

    const [dice, setDice] = useState(generateAllNewDice())

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false
            }))
    }

    function rollDice() {
        setDice(generateAllNewDice())
    }

    const diceElements = dice.map(num => <Die value={num.value} />)

    return (
        <main>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>Roll</button>
        </main>
    )
}