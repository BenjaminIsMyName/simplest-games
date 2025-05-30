import confetti from 'https://cdn.skypack.dev/canvas-confetti'

const GRID_SIZE = 4
const WINNING_NUMBER = 2048

const gameOverSound = new Audio('game-over.wav')

function Game2048(_size) {
    this.size = _size
    this.score = 0
    this.gameOver = false
    this.gameElement = document.getElementById('game')
    this.tilesToRemove = []

    Game2048.prototype.startGame = function () {
        this.grid = Array.from({ length: this.size }, () =>
            Array(this.size).fill({
                id: undefined,
                value: 0,
            })
        )

        this.addRandomTile()
        this.addRandomTile()
        this.render()
    }

    Game2048.prototype.restart = function () {
        this.score = 0
        this.gameOver = false
        this.gameElement.querySelectorAll('.tile').forEach(tile => {
            if (tile.classList.contains('tile--background')) return

            tile.remove()
        })
        this.startGame()
    }

    Game2048.prototype.addRandomTile = function () {
        const emptyPositions = []
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c].value === 0) emptyPositions.push([r, c])
            }
        }

        if (emptyPositions.length <= 0) {
            this.gameOver = true
            return
        }

        const [row, col] =
            emptyPositions[Math.floor(Math.random() * emptyPositions.length)]

        const tileId = crypto.randomUUID()

        this.grid[row][col] = {
            id: tileId,
            value: Math.random() < 0.9 ? 2 : 4,
        }
    }

    Game2048.prototype.move = function (direction) {
        if (this.gameOver) return

        const originalGrid = this.copyGrid(this.grid)

        switch (direction) {
            case 'up':
                this.grid = this.transpose(this.grid)
                this.shiftAndMerge()
                this.grid = this.transpose(this.grid)
                break
            case 'down':
                this.grid = this.transpose(this.grid)
                this.grid = this.reverseRows(this.grid)
                this.shiftAndMerge()
                this.grid = this.reverseRows(this.grid)
                this.grid = this.transpose(this.grid)
                break
            case 'left':
                this.shiftAndMerge()
                break
            case 'right':
                this.grid = this.reverseRows(this.grid)
                this.shiftAndMerge()
                this.grid = this.reverseRows(this.grid)
                break
            default:
                throw new Error('Invalid direction')
        }

        const isValidMove = !this.areGridsEqual(originalGrid, this.grid)

        if (isValidMove) {
            this.addRandomTile()
            this.render()
        }
        // Alert if no moves remain.
        if (!this.hasMoves()) {
            this.gameOver = true
            gameOverSound.volume = 0.1
            gameOverSound.play()
        }
    }

    // Shift and merge all rows to the left
    Game2048.prototype.shiftAndMerge = function () {
        for (let r = 0; r < this.size; r++) {
            this.grid[r] = this.mergeRow(this.grid[r])
        }
    }

    // Merge one row to the left
    Game2048.prototype.mergeRow = function (row) {
        //TODO CHECK HERE
        row = row.filter(cell => cell.value !== 0) // Remove zeros

        for (let i = 0; i < row.length - 1; i++) {
            if (row[i].value === row[i + 1].value) {
                const scoreToAdd = row[i].value

                row[i].value += scoreToAdd
                row[i].mergedWith = row[i + 1].id
                row[i + 1].value = 0

                this.score += scoreToAdd
            }
        }

        const fileredRow = row.filter(cell => cell.value !== 0)
        const nowEmptyCells = row.filter(cell => cell.value == 0)

        const result = fileredRow.concat(nowEmptyCells).concat(
            Array(this.size - fileredRow.length - nowEmptyCells.length).fill({
                id: undefined,
                value: 0,
            })
        ) // Refill with zeros

        return result
    }

    // Reverse all rows
    Game2048.prototype.reverseRows = function (grid) {
        return grid.map(row => row.reverse())
    }

    // Transpose the grid (to switch between rows and columns)
    Game2048.prototype.transpose = function (grid) {
        return grid[0].map((_, colIndex) => grid.map(row => row[colIndex]))
    }

    Game2048.prototype.areGridsEqual = function (grid1, grid2) {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (grid1[r][c].value !== grid2[r][c].value) return false
            }
        }
        return true
    }

    // Copy the grid (to compare previous state with current)
    Game2048.prototype.copyGrid = function (grid) {
        return JSON.parse(JSON.stringify(grid))
    }

    Game2048.prototype.render = function () {
        const deleteTiles = () => {
            for (let tileId of this.tilesToRemove) {
                const tileElement = document.getElementById(`tile-${tileId}`)

                if (tileElement) {
                    tileElement.classList.remove('tile')
                    tileElement.viewTransitionName = undefined
                    tileElement.remove()
                }
            }
        }

        const updateScore = () => {
            const scoreElement = document.getElementById('score')

            if (!scoreElement) return

            scoreElement.value = this.score
        }

        const renderLoop = () => {
            /**
             * Remove all tiles that were mergedin the last loop
             * This ensures view transitions are exectuted correctly
             **/
            deleteTiles()
            updateScore()

            for (let r = 0; r < this.size; r++) {
                for (let c = 0; c < this.size; c++) {
                    const tile = this.grid[r][c]

                    if (tile.value === WINNING_NUMBER) {
                        this.gameOver = true
                        this.showWinScreen()
                    }

                    if (tile.id) {
                        const tileElement = document.getElementById(
                            `tile-${tile.id}`
                        )

                        if (tileElement && tile.value > 0) {
                            this.moveTileElement(
                                tile.id,
                                r + 1,
                                c + 1,
                                tile.value
                            )

                            if (tile.mergedWith) {
                                const mergedTile = document.getElementById(
                                    `tile-${tile.mergedWith}`
                                )
                                this.tilesToRemove.push(tile.mergedWith)

                                if (mergedTile) {
                                    this.moveTileElement(
                                        tile.mergedWith,
                                        r + 1,
                                        c + 1,
                                        tile.value
                                    )
                                    mergedTile.style.zIndex = 1
                                }

                                tile.mergedWith = undefined
                            }
                        } else if (tileElement === null && tile.value > 0) {
                            this.createTileElement(
                                tile.id,
                                r + 1,
                                c + 1,
                                tile.value
                            )
                        }
                    }
                }
            }
        }

        if (!document.startViewTransition) {
            renderLoop()
            return
        }

        document.startViewTransition(renderLoop)
    }

    Game2048.prototype.createTileElement = function (id, row, column, value) {
        const tileElement = document.createElement('div')
        tileElement.id = `tile-${id}`
        tileElement.setAttribute('data-value', value)
        tileElement.classList.add('tile')
        tileElement.style.viewTransitionName = `tile-${id}`
        tileElement.style.gridRowStart = row
        tileElement.style.gridColumnStart = column
        tileElement.textContent = value

        this.gameElement.appendChild(tileElement)
    }

    Game2048.prototype.moveTileElement = function (id, row, col, value) {
        const tileElement = document.getElementById(`tile-${id}`)

        if (!tileElement) throw new Error('Tile not found')

        tileElement.textContent = value
        tileElement.setAttribute('data-value', value)
        tileElement.style.gridRowStart = row
        tileElement.style.gridColumnStart = col
    }

    Game2048.prototype.showWinScreen = function () {
        const winScreen = document.getElementById('win-overlay')
        winScreen.style.display = 'flex'

        const restartButton = document.getElementById('restart-win')
        restartButton.addEventListener(
            'click',
            () => {
                this.restart()
                winScreen.style.display = 'none'
            },
            { once: true }
        )

        confetti()
    }

    Game2048.prototype.hasMoves = function () {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c].value === 0) return true
                if (
                    c < this.size - 1 &&
                    this.grid[r][c].value === this.grid[r][c + 1].value
                )
                    return true
                if (
                    r < this.size - 1 &&
                    this.grid[r][c].value === this.grid[r + 1][c].value
                )
                    return true
            }
        }
        return false
    }
}

const restartButton = document.getElementById('restart')
const themeButton = document.getElementById('theme-switch')

const game = new Game2048(GRID_SIZE)
game.startGame()

const themeManager = new ThemeManager()

restartButton.addEventListener('click', () => game.restart())
themeButton.addEventListener('click', () => themeManager.changeTheme())

function ThemeManager() {
    ThemeManager.prototype.changeTheme = function () {
        let currentTheme = this.currentTheme()

        if (currentTheme === 'theme--dark') {
            document.body.classList.remove('theme--dark')
            document.body.classList.add('theme--light')
            currentTheme = 'theme--light'
        } else {
            document.body.classList.remove('theme--light')
            document.body.classList.add('theme--dark')
            currentTheme = 'theme--dark'
        }

        localStorage.setItem('theme', currentTheme)
    }

    ThemeManager.prototype.currentTheme = function () {
        let selected = localStorage.getItem('theme')

        if (!selected) {
            const userPrefersDarkMode = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
            selected = userPrefersDarkMode ? 'theme--dark' : 'theme--light'
        }

        return selected
    }

    const theme = this.currentTheme()

    if (theme === 'theme--dark') {
        document.body.classList.add('theme--dark')
    } else {
        document.body.classList.add('theme--light')
    }

    handleInteractions()
}

function handleInteractions() {
    console.log('hello')
    document.addEventListener('keydown', event => {
        console.log('keydown', event)
        switch (event.key) {
            case 'ArrowLeft':
                game.move('left')
                break
            case 'ArrowUp':
                game.move('up')
                break
            case 'ArrowRight':
                game.move('right')
                break
            case 'ArrowDown':
                game.move('down')
                break
        }
    })

    const SWIPE_MOVEMENT_THRESHOLD = 20
    const SWIPE_TIME_LIMIT = 300
    let initX, initY, triggerTime

    game.gameElement.addEventListener('touchstart', event => {
        if (event.touches.length <= 0) return

        const touch = event.touches[0]

        initX = touch.clientX
        initY = touch.clientY
        triggerTime = new Date()
    })

    game.gameElement.addEventListener('touchmove', event => {
        const deltaTime = new Date() - triggerTime

        if (!initX || !initY || deltaTime > SWIPE_TIME_LIMIT) return

        if (event.changedTouches.length <= 0) return

        const touch = event.changedTouches[0]
        const endX = touch.clientX
        const endY = touch.clientY
        const deltaX = endX - initX
        const deltaY = endY - initY

        if (
            Math.abs(deltaX) <= SWIPE_MOVEMENT_THRESHOLD &&
            Math.abs(deltaY) <= SWIPE_MOVEMENT_THRESHOLD
        )
            return

        initX = undefined
        initY = undefined
        triggerTime = undefined

        const keyboardEvent = generateKeyboardEventFromSwipe(deltaX, deltaY)

        document.dispatchEvent(keyboardEvent)
    })
}

function generateKeyboardEventFromSwipe(horiDistance, vertDistance) {
    let key

    if (Math.abs(horiDistance) > Math.abs(vertDistance)) {
        if (horiDistance <= 0) {
            key = 'ArrowLeft'
        } else {
            key = 'ArrowRight'
        }
    } else {
        if (vertDistance <= 0) {
            key = 'ArrowUp'
        } else {
            key = 'ArrowDown'
        }
    }

    return new KeyboardEvent('keydown', {
        key: key,
    })
}
