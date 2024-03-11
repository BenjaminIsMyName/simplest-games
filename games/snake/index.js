let player = document.getElementById('player')
let container = document.getElementById('container')

addEventListener('keydown', handlePress)

let x = -50 // default x position of the player (in %)
let y = -50 // default y position of the player (in %)

let playerHeight = 20

showFood()

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

    setTimeout(checkIfAte, 100) // check if the player is touching the food after the transition is done
}

function checkIfAte() {
    let food = document.getElementById('food')

    if (elementsOverlap(player, food)) {
        x = -50
        y = -50
        handlePress({})
        food.remove() // remove the element from the page
        showFood() // show a new food element
        playerHeight = playerHeight + 20
        player.style.height = `${playerHeight}px`
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

function showFood() {
    container.innerHTML = `
    <div id="food" style='
        left: ${randomInteger(0, 95)}%;
        top: ${randomInteger(0, 95)}%;
    '></div>`
}
