let total = document.getElementById('total')

let amount = 0

function add() {
    amount = amount + 1
    total.innerHTML = amount
}

function take() {
    amount = amount - 1
    total.innerHTML = amount
}

// + חיבור
// - חיסור
// * כפל
// / חילוק
// % שארית
// ** חזקה
