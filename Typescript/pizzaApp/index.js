const menu = [
    { name: "Margherita", price: 8 },
    { name: "Pepperoni", price: 10 },
    { name: "Hawaiian", price: 10 },
    { name: "Veggie", price: 9 },
]

let cashInRegister = 100
const orderQueue = []


function addNewPizza(name, price) {
    menu.push({ name, price })
}

function placeOrder(pizzaName) {
    const selectedPizza = menu.find(pizzaObj => pizzaObj.name === pizzaName)
    cashInRegister += selectedPizza.price
    const newOrder = { pizza: selectedPizza, status: "ordered" }
    orderQueue.push(newOrder)
    return newOrder
}


console.log(placeOrder("Margherita"))
console.log(placeOrder("Pepperoni"))

console.log(cashInRegister) 