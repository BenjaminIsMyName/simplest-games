// TODO: Create a variable called `time` and set it to 10
// TODO: Create a variable called `score` and set it to 0
let picked = false
let timerInterval = false

let moveBoxesInterval = Math.max(500, 3000 - score * 100)
let randomNumber = document.getElementById('randomNumber')
let scoreElement = document.getElementById('score')
let timerId = document.getElementById('timerId')
let timeLeft = time
let lastMoveTime = Date.now()

let buttons = document.querySelectorAll('button')

let clickAudio = new Audio('game-click.wav')
let overAudio = new Audio('game-over.wav')

pick()
moveBoxes()

function check(clicked) {
    if (picked == clicked) {
        clickAudio.pause()
        clickAudio.currentTime = 0
        clickAudio.play()
        score = score + 1
        pick()
        adjustMoveBoxesSpeed()
    } else {
        overAudio.pause()
        overAudio.currentTime = 0
        overAudio.volume = 0.1
        overAudio.play()
        alert('You lost because you clicked wrong! Your score is: ' + score)
        window.location.reload()
    }
    scoreElement.innerHTML = 'Score: ' + score
}

function pick() {
    scoreElement.innerHTML = 'Score: ' + score
    picked = randomInteger(1, 3)
    randomNumber.innerHTML = picked
    if (timerInterval) {
        clearInterval(timerInterval)
    }
    timerInterval = setInterval(timer, 1000)
    timeLeft = time
    timerId.innerHTML = 'Time left: ' + timeLeft
}

function timer() {
    timeLeft = timeLeft - 1
    timerId.innerHTML = 'Time left: ' + timeLeft

    if (timeLeft == 0) {
        alert('You lost because of time! Your score is: ' + score)
        window.location.reload()
    }
}

function moveBox(box) {
    const x = randomInteger(0, window.innerWidth - 550)
    const y = randomInteger(0, window.innerHeight - 550)
    box.style.left = `${x}px`
    box.style.top = `${y}px`
}

function moveBoxes() {
    const now = Date.now()
    if (now - lastMoveTime >= moveBoxesInterval) {
        for (const button of buttons) {
            button.style.position = 'absolute'
            moveBox(button)
        }
        lastMoveTime = now
    }
    requestAnimationFrame(moveBoxes)
}

// Move boxes immediately when the game starts
for (const button of buttons) {
    button.style.position = 'absolute'
    moveBox(button)
}
requestAnimationFrame(moveBoxes)

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function adjustMoveBoxesSpeed() {
    moveBoxesInterval = Math.max(500, 3000 - score * 100) // Minimum interval of 500ms
}
