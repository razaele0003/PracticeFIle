
import Main from "./components/Main"

function allNewDice(){
     const randomArr = [];
        for (let i = 0; i < 10; i++) {
            
            const randomNumber = Math.floor(Math.random() * 6)+1;
            randomArr.push(randomNumber);
        }
         console.log(randomArr)
        return randomArr;
       
}

allNewDice()


export default function App(){
    return(<Main/>)
}
