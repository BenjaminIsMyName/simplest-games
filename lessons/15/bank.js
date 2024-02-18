let usernameFromStorage = localStorage.getItem('username')

if (!usernameFromStorage) {
    location.href = 'index.html'
}

let title = document.getElementById('title')
title.innerHTML = 'ברוך הבא, ' + usernameFromStorage

let total = 0
let amount = document.getElementById('amount')
let totalFromStorage = localStorage.getItem('total')

if (totalFromStorage) {
    total = Number(totalFromStorage)
    amount.innerHTML = total
}

function change(num) {
    total = total + num
    amount.innerHTML = total
    localStorage.setItem('total', total)
}
