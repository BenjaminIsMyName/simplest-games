function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let time = 5
let score = 0

let randomNumber = document.getElementById('randomNumber')
let scoreElement = document.getElementById('score')
let picked = undefined
let interval = undefined
let timerId = document.getElementById('timerId')
let timeLeft = time

pick()

function check(clicked) {
    if (picked == clicked) {
        score = score + 1
        pick()
    } else {
        alert('You lost because you clicked wrong! Your score is: ' + score)
        window.location.reload()
    }

    scoreElement.innerHTML = 'Score: ' + score
}

function pick() {
    scoreElement.innerHTML = 'Score: ' + score
    picked = randomInteger(1, 3)
    randomNumber.innerHTML = picked
    if (interval) {
        clearInterval(interval)
    }
    interval = setInterval(timer, 1000)
    timeLeft = time
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
        alert('You lost because of time! Your score is: ' + score)
        window.location.reload()
    }
}
