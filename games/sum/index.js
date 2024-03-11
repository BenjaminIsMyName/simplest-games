let player = document.getElementById('player')
let container = document.getElementById('container')
let numbers = document.getElementById('numbers')
let total = document.getElementById('total')
let ate = []

addEventListener('keydown', handlePress)

let x = -50 // default x position of the player (in %)
let y = -50 // default y position of the player (in %)

function handlePress(e) {
    if (e.key === 'ArrowUp') {
        y -= 100
    } else if (e.key === 'ArrowDown') {
        y += 100
    }
    if (e.key === 'ArrowLeft') {
        x -= 100
    }
    if (e.key === 'ArrowRight') {
        x += 100
    }

    player.style.transform = `translate(${x}%, ${y}%)`

    // check if the player ate a food after transition is done
    setInterval(checkIfAte, 200)
}

function checkIfAte() {
    let foods = document.querySelectorAll('.food')

    for (const food of foods) {
        if (elementsOverlap(player, food)) {
            food.remove() // remove the element from the page
            ate.push(Number(food.innerHTML))
            numbers.innerHTML += Number(food.innerHTML) + ' + '
            checkSum()
        }
    }
}

function checkSum() {
    let sum = 0
    for (let i = 0; i < ate.length; i++) {
        sum += ate[i]
    }
    total.innerHTML = sum

    if (sum == 20) {
        alert('You WON!!!!!!!!!!!!!!!!!!! 😎')
        window.location.reload()
    } else if (sum > 20) {
        alert('You lost!! 🥲')
        window.location.reload()
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function elementsOverlap(el1, el2) {
    const domRect1 = el1.getBoundingClientRect()
    const domRect2 = el2.getBoundingClientRect()

    return !(
        domRect1.top > domRect2.bottom ||
        domRect1.right < domRect2.left ||
        domRect1.bottom < domRect2.top ||
        domRect1.left > domRect2.right
    )
}

function showFood(num) {
    container.innerHTML += `
    <div class="food" style='
        left: ${randomInteger(0, 95)}%;
        top: ${randomInteger(0, 95)}%;
    '>${num}</div>`
}

for (let i = 1; i < 10; i++) {
    showFood(i)
}
