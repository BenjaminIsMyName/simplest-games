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
        score = 0
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

    // Increase the speed of the buttons every 5 points
    // 5: -1
    // 10: -2
    // 15: -3
    if (score % 5 == 0 && score != 0 && score < 20) {
        let btn1 = document.getElementById('btn1')
        let btn2 = document.getElementById('btn2')
        let btn3 = document.getElementById('btn3')

        // TODO: currently, when changing the duration - the animation is resetting and flickering. Fix it.
        btn1.style.animationDuration = 5 - score / 5 + 's'
        btn2.style.animationDuration = 5 - score / 5 + 's'
        btn3.style.animationDuration = 5 - score / 5 + 's'
    }
}

function timer() {
    timeLeft = timeLeft - 1
    timerId.innerHTML = 'Time left: ' + timeLeft

    if (timeLeft == 0) {
        alert('You lostttttttttttttttttttttttttttttttttttttttt')
        score = 0
        scoreElement.innerHTML = 'Score: ' + score
        timeLeft = 5
        timerId.innerHTML = 'Time left: ' + timeLeft
    }
}
