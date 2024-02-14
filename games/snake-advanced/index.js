let player = document.getElementById('player')
let container = document.getElementById('container')

document.addEventListener('keydown', handlePress)

let x = -50 // default x position of the player (in %)
let y = -50 // default y position of the player (in %)

let playerHeight = 1
let directionRotation = 0 // 0 = up, 90 = right, 180 = down, 270 = left

showFood()

function handlePress(e) {
    if (e.key === 'ArrowUp') {
        y -= 100
        directionRotation += getRotate(directionRotation, 0)
    } else if (e.key === 'ArrowDown') {
        y += 100
        directionRotation += getRotate(directionRotation, 180)
    }
    if (e.key === 'ArrowLeft') {
        x -= 100
        directionRotation += getRotate(directionRotation, 270)
    }
    if (e.key === 'ArrowRight') {
        x += 100
        directionRotation += getRotate(directionRotation, 90)
    }

    updatePlayerPosition()

    setTimeout(checkIfAte, 100) // check if the player is touching the food after the transition is done
}

function updatePlayerPosition() {
    player.style.transform = `translate(${x}%, ${y}%) rotate(${directionRotation}deg) scaleY(${playerHeight})`
}

// Returns the number of degrees to rotate from currentDirection to targetDirection
// So if the current direction is 0 (up) and the target direction is 270 (left), the function should return -90
// And if the current direction is 450 (right) and the target direction is 90 (right), the function should return 0
function getRotate(currentDirection, targetDirection) {
    // Normalize directions to be in the range [0, 360)
    currentDirection = (currentDirection + 360) % 360
    targetDirection = (targetDirection + 360) % 360

    // Calculate the clockwise and counterclockwise rotations
    const clockwiseRotation = (targetDirection - currentDirection + 360) % 360
    const counterclockwiseRotation =
        (currentDirection - targetDirection + 360) % 360

    // Choose the shortest rotation direction
    if (clockwiseRotation <= counterclockwiseRotation) {
        return clockwiseRotation
    } else {
        // Return a negative value for counterclockwise rotation
        return -counterclockwiseRotation
    }
}

function checkIfAte() {
    let food = document.getElementById('food')

    if (elementsOverlap(player, food)) {
        food.remove() // remove the element from the page
        showFood() // show a new food element
        playerHeight = playerHeight + 0.5
        updatePlayerPosition()
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
