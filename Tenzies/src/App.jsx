
import Main from "./components/Main"

    function allNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => Math.ceil(Math.random() * 6))
    }
       



export default function App(){
    return(<Main/>)
}
