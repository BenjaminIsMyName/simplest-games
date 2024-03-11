let player = document.getElementById('player')

let x = 0

addEventListener('keydown', checkKey)

function checkKey(info) {
    if (info.key == 'ArrowRight') {
        x = x + 150
    } else if (info.key == 'ArrowLeft') {
        x = x - 150
    }

    player.style.left = x + 'px'
}

setInterval(createEnemy, 500)

function createEnemy() {
    // if we use innerHTML += then we will recreate all the images every time we add an image, which causes problems
    let enemy = document.createElement('img')
    enemy.style.left = randomInteger(0, 100) + '%'
    enemy.className = 'enemies'
    enemy.src = 'enemy.png'

    document.getElementById('enemies').append(enemy)
    setTimeout(function () {
        enemy.remove()
    }, 3000) // same as the animation duration in CSS
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shoot() {
    bulletLeft.classList.add('animate')
    bulletRight.classList.add('animate')
    firedBullets.push(bulletLeft)
    firedBullets.push(bulletRight)
    createBullets()
}

let bulletLeft
let bulletRight

let firedBullets = []

createBullets()

function createBullets() {
    bulletLeft = document.createElement('div')
    bulletLeft.className = 'bullet bulletLeft'
    player.append(bulletLeft)
    bulletRight = document.createElement('div')
    bulletRight.className = 'bullet bulletRight'
    player.append(bulletRight)
}

let checkHitInterval = setInterval(checkHit, 1)

function checkHit() {
    let enemies = document.getElementsByClassName('enemies')
    for (let i = 0; i < enemies.length; i++) {
        if (elementsOverlap(player, enemies[i])) {
            clearInterval(checkHitInterval)
            alert('Game over!')
            location.reload()
        }

        for (let j = 0; j < firedBullets.length; j++) {
            if (elementsOverlap(firedBullets[j], enemies[i])) {
                enemies[i].remove()
                firedBullets[j].remove()
                firedBullets.splice(j, 1)
            }
        }
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
