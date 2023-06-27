let scoreElement = document.getElementById('scoreId')
let arrowElement = document.getElementById('arrowId')

let score = 0

let arrows = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Arrow_left.svg/1280px-Arrow_left.svg.png',
    'https://cdn-icons-png.flaticon.com/512/2/2231.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Arrow_right.svg/1280px-Arrow_right.svg.png',
    'https://clipart-library.com/img1/1236729.png',
]

let picked = 0

// 0 - left
// 1 - up
// 2 - right
// 3 - down

setInterval(pickImage, 3000)

function pickImage() {
    arrowElement.classList.remove('animate')
    arrowElement.offsetHeight
    picked = randomInteger(0, 3)
    arrowElement.setAttribute('src', arrows[picked])
    arrowElement.classList.add('animate')
}

pickImage()

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

window.addEventListener('keydown', checkKey)

function checkKey(info) {
    if (
        info.key != 'ArrowLeft' &&
        info.key != 'ArrowUp' &&
        info.key != 'ArrowRight' &&
        info.key != 'ArrowDown'
    ) {
        return // not arrow? get out of this function
    }

    let userPicked = 0
    if (info.key == 'ArrowLeft') {
        userPicked = 0
    }

    if (info.key == 'ArrowUp') {
        userPicked = 1
    }

    if (info.key == 'ArrowRight') {
        userPicked = 2
    }

    if (info.key == 'ArrowDown') {
        userPicked = 3
    }

    if (userPicked == picked) {
        updateScore(score + 1)
    } else {
        updateScore(0)
        alert('Game over!')
    }
}

function updateScore(newScore) {
    score = newScore
    scoreElement.innerHTML = 'Score: ' + score
}
