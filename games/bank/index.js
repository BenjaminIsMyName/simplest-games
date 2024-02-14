let amount = 0
let amountElement = document.getElementById('amountId')

function add() {
    amount++
    amountElement.innerHTML = amount
}

function take() {
    amount--
    amountElement.innerHTML = amount
}
