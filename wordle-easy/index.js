let words = [
    'שלום',
    'יונה',
    'חלון',
    'חמוד',
    'ארנב',
    'ארנק',
    'איתי',
    'שחמט',
    'שממה',
    'בננה',
    'מתוק',
    'כיסא',
    'יופי',
    'מחשב',
    'עכבר',
]

let guesses = 0

let toGuess = words[randomInteger(0, words.length - 1)]

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let inputElement = document.getElementById('wordId')
let container = document.getElementById('container')

function guess() {
    guesses = guesses + 1

    let firstLetter = inputElement.value.charAt(0)
    let secondLetter = inputElement.value.charAt(1)
    let thirdLetter = inputElement.value.charAt(2)
    let fourthLetter = inputElement.value.charAt(3)

    container.innerHTML += `
    
        <div class="row">
            <div style="background-color: ${check(
                firstLetter,
                0
            )}" class="letter">${firstLetter}</div>
            <div style="background-color: ${check(
                secondLetter,
                1
            )}" class="letter">${secondLetter}</div>
            <div style="background-color: ${check(
                thirdLetter,
                2
            )}" class="letter">${thirdLetter}</div>
            <div style="background-color: ${check(
                fourthLetter,
                3
            )}" class="letter">${fourthLetter}</div>
        </div>
    
    `

    if (toGuess == inputElement.value) {
        setTimeout(() => {
            alert('ניצחת!') // setTimeout is required because the alert will block the page from updating
            window.location.reload()
        }, 500)
    } else if (guesses == 6) {
        setTimeout(() => {
            alert('הפסדת! המילה הייתה... ' + toGuess)
            window.location.reload()
        }, 500)
    }

    inputElement.value = ''
}

function check(letter, index) {
    if (toGuess.charAt(index) == letter) {
        return 'green'
    }
    if (toGuess.includes(letter)) {
        return 'yellow'
    }

    return 'red'
}
