const button = document.querySelector('button')
const input = document.querySelector('input')
const result = document.querySelector('#result')

button.addEventListener('click', () => {
    if (!/^[a-zA-Z]+$/.test(input.value)) {
        alert('Please enter text in English')
        return
    }

    result.innerHTML = '' // Clear previous result
    const name = input.value.split('')
    const reversedName = [...name].reverse()
    const letterWidth = 50
    const totalWidth = name.length * letterWidth
    const startPosition = (result.clientWidth - totalWidth) / 2

    // Create a map to track the positions of each letter in the reversed name
    const letterPositions = {}
    reversedName.forEach((letter, index) => {
        if (!letterPositions[letter]) {
            letterPositions[letter] = []
        }
        letterPositions[letter].push(index)
    })

    name.forEach((letter, index) => {
        const letterBox = document.createElement('div')
        letterBox.classList.add('letter-box')
        letterBox.textContent = letter
        letterBox.style.left = `${startPosition + index * letterWidth}px`
        const reversedIndex = letterPositions[letter].shift()
        letterBox.style.setProperty(
            '--move-distance',
            `${(reversedIndex - index) * letterWidth}`
        )
        result.appendChild(letterBox)
    })
})
