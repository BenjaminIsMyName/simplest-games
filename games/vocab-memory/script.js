const vocabulary = [
    { english: 'File', hebrew: 'קובץ' },
    { english: 'Folder', hebrew: 'תיקייה' },
    { english: 'Open', hebrew: 'פתח' },
    { english: 'Save', hebrew: 'שמור' },
    { english: 'Delete', hebrew: 'מחק' },
    { english: 'Rename', hebrew: 'שנה שם' },
    { english: 'Copy', hebrew: 'העתק' },
    { english: 'Paste', hebrew: 'הדבק' },
    { english: 'Run', hebrew: 'הרץ / הפעל' },
    { english: 'Code', hebrew: 'קוד' },
    { english: 'Function', hebrew: 'פונקציה' },
    { english: 'Number', hebrew: 'מספר' },
    { english: 'If', hebrew: 'אם' },
    { english: 'While', hebrew: 'כל עוד / בזמן ש' },
    { english: 'Push', hebrew: 'דחוף / שלח' },
    { english: 'Computer', hebrew: 'מחשב' },
    { english: 'Repository', hebrew: 'מאגר / ריפוזיטורי' },
    { english: 'Return', hebrew: 'החזר / החזרה' },
    { english: 'Prompt', hebrew: 'הנחיה / פרומפט' },
    { english: 'Agent', hebrew: 'סוכן' },
    { english: 'Element', hebrew: 'אלמנט' },
    { english: 'Class', hebrew: 'מחלקה / קלאס' },
    { english: 'ID', hebrew: 'מזהה' },
    { english: 'Style', hebrew: 'עיצוב / סגנון' },
    { english: 'Click', hebrew: 'לחיצה / לחץ' },
    { english: 'Error', hebrew: 'שגיאה' },
]

const difficultySelect = document.querySelector('#difficulty')
const restartButton = document.querySelector('#restartButton')
const memoryBoard = document.querySelector('#memoryBoard')
const statusMessage = document.querySelector('#statusMessage')
const movesValue = document.querySelector('#movesValue')
const matchesValue = document.querySelector('#matchesValue')
const remainingValue = document.querySelector('#remainingValue')

const state = {
    moves: 0,
    matches: 0,
    lockBoard: false,
    firstCard: null,
    secondCard: null,
    selectedPairs: [],
}

function shuffle(items) {
    const clonedItems = [...items]

    for (let index = clonedItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        ;[clonedItems[index], clonedItems[randomIndex]] = [
            clonedItems[randomIndex],
            clonedItems[index],
        ]
    }

    return clonedItems
}

function createCard({ pairId, language, word }) {
    const card = document.createElement('button')
    card.type = 'button'
    card.className = 'memory-card'
    card.dataset.pairId = pairId
    card.dataset.language = language
    card.setAttribute('aria-label', `כרטיס ${language === 'english' ? 'באנגלית' : 'בעברית'}`)

    card.innerHTML = `
        <span class="card-inner">
            <span class="card-face card-back" aria-hidden="true">
                <span class="brand-tab"></span>
                <span class="brand-shell">
                    <span class="brand-ring"></span>
                    <img
                        class="brand-logo"
                        src="mpg-logo.png"
                        alt=""
                    />
                    <span class="brand-title">MPG</span>
                    <span class="brand-subtitle">English Memory Card</span>
                </span>
            </span>
            <span class="card-face card-front" data-language="${language}">
                <span class="card-language">${language === 'english' ? 'English' : 'עברית'}</span>
                <span class="card-word" lang="${language === 'english' ? 'en' : 'he'}">${word}</span>
                <span class="card-hint">מצאו את הכרטיס המתאים</span>
            </span>
        </span>
    `

    card.addEventListener('click', () => handleCardClick(card))
    return card
}

function updateStats() {
    movesValue.textContent = state.moves
    matchesValue.textContent = state.matches
    remainingValue.textContent = state.selectedPairs.length - state.matches
}

function setStatus(message) {
    statusMessage.textContent = message
}

function resetTurn() {
    state.firstCard = null
    state.secondCard = null
    state.lockBoard = false
}

function finishGame() {
    setStatus(`מעולה! מצאתם את כל ${state.selectedPairs.length} הזוגות ב-${state.moves} מהלכים.`)
}

function handleMismatch() {
    state.lockBoard = true
    setStatus('כמעט. נסו לזכור איפה נמצא התרגום המתאים.')

    window.setTimeout(() => {
        state.firstCard.classList.remove('is-flipped')
        state.secondCard.classList.remove('is-flipped')
        resetTurn()
    }, 900)
}

function handleMatch() {
    state.firstCard.classList.add('is-matched')
    state.secondCard.classList.add('is-matched')
    state.firstCard.disabled = true
    state.secondCard.disabled = true
    state.matches += 1
    updateStats()

    if (state.matches === state.selectedPairs.length) {
        finishGame()
    } else {
        setStatus('יש התאמה! ממשיכים לזוג הבא.')
    }

    resetTurn()
}

function handleCardClick(card) {
    if (
        state.lockBoard ||
        card === state.firstCard ||
        card.classList.contains('is-matched')
    ) {
        return
    }

    card.classList.add('is-flipped')

    if (!state.firstCard) {
        state.firstCard = card
        setStatus('כרטיס ראשון נחשף. עכשיו חפשו את הכרטיס המשלים.')
        return
    }

    state.secondCard = card
    state.moves += 1
    updateStats()

    const isMatch = state.firstCard.dataset.pairId === state.secondCard.dataset.pairId
    if (isMatch) {
        handleMatch()
        return
    }

    handleMismatch()
}

function buildDeck(pairCount) {
    state.selectedPairs = shuffle(vocabulary).slice(0, pairCount)

    const deck = state.selectedPairs.flatMap((entry, index) => [
        createCard({
            pairId: `pair-${index}`,
            language: 'english',
            word: entry.english,
        }),
        createCard({
            pairId: `pair-${index}`,
            language: 'hebrew',
            word: entry.hebrew,
        }),
    ])

    return shuffle(deck)
}

function renderBoard() {
    const pairCount = Number(difficultySelect.value)

    state.moves = 0
    state.matches = 0
    resetTurn()
    memoryBoard.innerHTML = ''

    const deck = buildDeck(pairCount)
    const columns = pairCount >= 20 ? 6 : pairCount >= 12 ? 4 : pairCount >= 8 ? 4 : 3
    memoryBoard.style.setProperty('--board-columns', columns)

    deck.forEach(card => {
        memoryBoard.append(card)
    })

    updateStats()
    setStatus('הלוח מוכן. הפכו כרטיס באנגלית וכרטיס בעברית כדי למצוא זוג.')
}

difficultySelect.addEventListener('change', renderBoard)
restartButton.addEventListener('click', renderBoard)

renderBoard()
