import Die from "./components/Die"
import React from "react"


export default function App() {
    const [number, setNumber] = React.useState(generateAllNewDice())
    
    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => Math.ceil(Math.random() * 6))
    }
    
     const diceElements = number.map((num, index) => (
        <Die key={index} value={num} />
    ))
    
    return (
        <main>
            <div className="dice-container">
               {diceElements}
            </div>
        </main>
    )
}