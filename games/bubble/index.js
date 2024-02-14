let container = document.getElementById('container')
let scoreElement = document.getElementById('score')

let score = 0

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function handleClick(bubble) {
    score++
    scoreElement.innerHTML = score
    bubble.remove()
}

function showBubble() {
    container.innerHTML += `
        <img 
            onclick="handleClick(this)"
            class="bubble" 
            src="https://www.freeiconspng.com/uploads/water-bubble-png-2.png"
            style="
                left: ${randomInteger(0, 95)}%;
                top: ${randomInteger(0, 95)}%;
            "
        >
    `
}

for (let i = 0; i < 50; i++) {
    showBubble()
}
