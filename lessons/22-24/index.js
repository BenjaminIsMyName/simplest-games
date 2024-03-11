addEventListener('keydown', checkKey)
let player = document.getElementById('player')
let enemy = document.getElementById('enemy')
let scoreElement = document.getElementById('scoreId')

let score = 0
let isJumping = false
let checkTouchInterval = setInterval(checkCollision, 100)

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
    let jumpSound = new Audio('jump.wav')
    jumpSound.play()
}

function removeAnimation() {
    player.classList.remove('jump')
    isJumping = false
    score++ // increase score when the player lands
    scoreElement.innerHTML = 'Your score: ' + score
}

function checkCollision() {
    if (elementsOverlap(player, enemy)) {
        clearInterval(checkTouchInterval) // stop checking for collision
        let best = localStorage.getItem('best')
        // if first game (no record is saved) or if the user has beaten his record:
        if (!best || best < score) {
            localStorage.setItem('best', score)
            best = score
        }

        document.body.innerHTML = `
                <p id="overId"> Game Over! </p>  
                <p id="result"> Your score is ${score}  </p> 
                <p id="best"> Your best score is... ${best}  </p> 
        `
        let overSound = new Audio('game-over.wav')
        overSound.play()
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
