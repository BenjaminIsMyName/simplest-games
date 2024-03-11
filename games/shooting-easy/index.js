let gun = document.getElementById('gunContainer')
let bullet = document.getElementById('bullet')

let target = document.getElementById('target')
let scoreElement = document.getElementById('scoreId')

let score = 0

let scoreFromStorage = localStorage.getItem('score')

if (scoreFromStorage) {
    score = Number(scoreFromStorage)
    scoreElement.innerHTML = 'Score: ' + score
}

addEventListener('keydown', checkKey)

let x = 0
let didShoot = false

function checkKey(info) {
    if (info.key == 'ArrowLeft') {
        x = x - 10
    }

    if (info.key == 'ArrowRight') {
        x = x + 10
    }

    gun.style.transform = `translateX(${x}px)`
}

function shoot() {
    if (didShoot == false) {
        bullet.classList.add('playAnimation')
        setTimeout(checkTarget, 100)
        didShoot = true
    }
}

function checkTarget() {
    if (elementsOverlap(bullet, target)) {
        score = score + 1
    } else {
        score = score - 1
    }

    scoreElement.innerHTML = 'Score: ' + score
    localStorage.setItem('score', score)
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
