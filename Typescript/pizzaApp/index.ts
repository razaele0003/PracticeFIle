
type pizza = {
    name: string
    price: number

}
const menu: pizza[] = [
    { name: "Margherita", price: 8 },
    { name: "Pepperoni", price: 10 },
    { name: "Hawaiian", price: 10 },
    { name: "Veggie", price: 9 },
]
const menu = [
    { name: "Margherita", price: 8 },
    { name: "Pepperoni", price: 10 },
    { name: "Hawaiian", price: 10 },
    { name: "Veggie", price: 9 },
]

let cashInRegister: number = 100
let nextOrderId: number = 1
let orderQueue: Order[] = []

type Pizza = {
    name: string
    price: number
}

type Order = {
    id: number
    pizza: Pizza
    status: string
}


function addNewPizza(name: string, price: number) {
    menu.push({ name, price })
}

function placeOrder(pizzaName: string) {
    const selectedPizza = menu.find(pizzaObj => pizzaObj.name === pizzaName)
    if (!selectedPizza) {
        console.error(`${pizzaName} does not exist in the menu`)
        return
    }
    cashInRegister += selectedPizza.price
    const newOrder: Order = { id: nextOrderId++, pizza: selectedPizza, status: "ordered" }
    orderQueue.push(newOrder)
    return newOrder
}

function completeOrder(orderId: number) {
    const order = orderQueue.find(order => order.id === orderId)
    if (!order) {
        console.log("no order")
        return ``
    }

    order.status = "completed"
    return order
}


addNewPizza("Adobo Pizza", 12)

console.log("menu : ", menu)
console.log(placeOrder("Adobo Pizza"))

console.log(orderQueue)
console.log(cashInRegister)     