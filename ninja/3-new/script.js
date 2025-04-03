const gameArea = document.getElementById('gameArea')
const player = document.getElementById('player')
const startBtn = document.getElementById('startBtn')
let alienInterval
let gameActive = false
let gameStartTime

const shootSound = new Audio('shoot.wav')

function createBullet() {
    // Only shoot if the game is active
    if (!gameActive) return
    const bullet = document.createElement('div')
    bullet.className = 'bullet'

    // Get bounding rects for positioning relative to gameArea.
    let gameAreaRect = gameArea.getBoundingClientRect()
    let playerRect = player.getBoundingClientRect()

    // Play shooting sound
    shootSound.currentTime = 0 // Reset sound to start
    shootSound.play()

    bullet.style.left =
        playerRect.left - gameAreaRect.left + playerRect.width / 2 - 2.5 + 'px'
    bullet.style.top = playerRect.top - gameAreaRect.top + 'px'
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
        // Increase alien speed over time.
        let elapsedSeconds = (Date.now() - gameStartTime) / 1000
        let speed = 5 + elapsedSeconds // speed increases over time
        alien.style.top = alien.offsetTop + speed + 'px'

        if (alien.offsetTop > window.innerHeight) {
            alien.remove()
            clearInterval(interval)
        }
        // If the alien hits the player, trigger game over.
        if (gameActive && isColliding(alien, player)) {
            gameOver()
            clearInterval(interval)
        }
    }, 50)
}

function isColliding(a, b) {
    const rectA = a.getBoundingClientRect()
    const rectB = b.getBoundingClientRect()
    return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
    )
}

function startGame() {
    // Reset game state
    gameActive = true
    gameStartTime = Date.now()
    startBtn.style.display = 'none'
    // Start alien creation only.
    alienInterval = setInterval(() => createAlien(), 1000)
}

function gameOver() {
    if (!gameActive) return
    gameActive = false
    clearInterval(alienInterval)
    document.querySelectorAll('.alien').forEach(alien => alien.remove())
    document.querySelectorAll('.bullet').forEach(bullet => bullet.remove())
    // Calculate score as elapsed seconds
    const score = Math.floor((Date.now() - gameStartTime) / 1000)
    showGameOverScreen(score)
    startBtn.style.display = 'block'
}

function showGameOverScreen(score) {
    let gameOverScreen = document.getElementById('gameOverScreen')
    gameOverScreen.querySelector('#score').textContent = score
    gameOverScreen.style.display = 'flex'
}

function restartGame() {
    const gameOverScreen = document.getElementById('gameOverScreen')
    if (gameOverScreen) {
        gameOverScreen.style.display = 'none'
    }
    startGame()
}

document.addEventListener('mousemove', e => {
    player.style.left = e.clientX - player.offsetWidth / 2 + 'px'
})

// Added event listener: shoot bullet on gameArea click.
gameArea.addEventListener('click', () => {
    if (gameActive) createBullet()
})

// Added event listener: shoot bullet on space bar press.
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && gameActive) {
        createBullet()
    }
})

startBtn.addEventListener('click', startGame)
