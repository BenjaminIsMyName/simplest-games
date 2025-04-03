const gameArea = document.getElementById('gameArea')
const player = document.getElementById('player')
const startBtn = document.getElementById('startBtn')
let gameInterval, alienInterval

function createBullet() {
    const bullet = document.createElement('div')
    bullet.className = 'bullet'
    bullet.style.left = player.offsetLeft + player.offsetWidth / 2 - 2.5 + 'px'
    bullet.style.top = player.offsetTop + 'px'
    gameArea.appendChild(bullet)
    moveBullet(bullet)
}

function moveBullet(bullet) {
    const interval = setInterval(() => {
        bullet.style.top = bullet.offsetTop - 10 + 'px'
        if (bullet.offsetTop < 0) {
            bullet.remove()
            clearInterval(interval)
        }
        document.querySelectorAll('.alien').forEach(alien => {
            if (isColliding(bullet, alien)) {
                bullet.remove()
                alien.remove()
                clearInterval(interval)
            }
        })
    }, 30)
}

function createAlien() {
    const alien = document.createElement('div')
    alien.className = 'alien'
    alien.style.left = Math.random() * (window.innerWidth - 40) + 'px'
    alien.style.top = '0px'
    gameArea.appendChild(alien)
    moveAlien(alien)
}

function moveAlien(alien) {
    const interval = setInterval(() => {
        alien.style.top = alien.offsetTop + 5 + 'px'
        if (alien.offsetTop > window.innerHeight) {
            alien.remove()
            clearInterval(interval)
        }
    }, 50)
}

function isColliding(a, b) {
    return !(
        a.offsetTop + a.offsetHeight < b.offsetTop ||
        a.offsetTop > b.offsetTop + b.offsetHeight ||
        a.offsetLeft + a.offsetWidth < b.offsetLeft ||
        a.offsetLeft > b.offsetLeft + b.offsetWidth
    )
}

function startGame() {
    startBtn.style.display = 'none'
    gameInterval = setInterval(() => createBullet(), 500)
    alienInterval = setInterval(() => createAlien(), 1000)
}

document.addEventListener('mousemove', e => {
    player.style.left = e.clientX - player.offsetWidth / 2 + 'px'
})

startBtn.addEventListener('click', startGame)
