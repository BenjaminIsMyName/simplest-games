const box = document.getElementById('box')
let startTime = Date.now()

function moveBox() {
    const x = Math.random() * (window.innerWidth - 50)
    const y = Math.random() * (window.innerHeight - 50)
    box.style.left = `${x}px`
    box.style.top = `${y}px`
}

box.addEventListener('click', () => {
    const endTime = Date.now()
    const timeTaken = ((endTime - startTime) / 1000).toFixed(1)
    location.reload()
})

setInterval(moveBox, 500)
moveBox()
