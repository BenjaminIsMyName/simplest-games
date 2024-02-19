function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let randomNumber = document.getElementById('randomNumber')
let scoreElement = document.getElementById('score')
let picked = 1
let score = 0
let interval
let timerId = document.getElementById('timerId')
let timeLeft = 5

pick()

function check(clicked) {
    if (picked == clicked) {
        score = score + 1
        pick()
    } else {
        endGame()
    }

    scoreElement.innerHTML = 'Score: ' + score
}

function pick() {
    picked = randomInteger(1, 3)
    randomNumber.innerHTML = picked
    if (interval) {
        clearInterval(interval)
    }
    interval = setInterval(timer, 1000)
    timeLeft = 5
    timerId.innerHTML = 'Time left: ' + timeLeft
}

function timer() {
    timeLeft = timeLeft - 1
    timerId.innerHTML = 'Time left: ' + timeLeft

    if (timeLeft == 0) {
        endGame()
    }
}

function endGame() {
    alert('You lostttttttttttttttttttttttttttttttttttttttt')
    score = 0
    scoreElement.innerHTML = 'Score: ' + score
    timeLeft = 5
    timerId.innerHTML = 'Time left: ' + timeLeft
}
