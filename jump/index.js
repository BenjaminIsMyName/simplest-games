window.addEventListener('keydown', checkKey)
let player = document.getElementById('player')
let enemy = document.getElementById('enemy')
let scoreElement = document.getElementById('scoreId')

let score = 0
let isJumping = false

setInterval(updateScore, 1500) // same as the animation duration in css for the enemy

function updateScore() {
    score++
    scoreElement.innerHTML = 'Your score: ' + score
}

function checkKey(e) {
    // check if pressed the space key
    if (e.key === ' ') {
        jump()
    }
}

function jump() {
    if (isJumping) {
        return // get out of the function
    }
    isJumping = true
    player.classList.add('jump')
    setTimeout(removeAnimation, 1000)
}

function removeAnimation() {
    player.classList.remove('jump')
    isJumping = false
}

setInterval(checkCollision, 100)

function checkCollision() {
    if (elementsOverlap(player, enemy)) {
        alert('Game Over! Your score is ' + score + '...')
        window.location.reload()
    }
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
