document.addEventListener('keydown', check)

let num = document.getElementById('num')

function check(info) {
    // if it's a positive digit
    if (info.key > 0 && info.key <= 9) {
        // start a countdown from the digit that the user pressed on
        num.innerHTML = info.key // show the number on the screen first
        setInterval(everySec, 1000) // then start the countdown
    }
}

function everySec() {
    num.innerHTML = num.innerHTML - 1 // decrease the number
    if (num.innerHTML == 0) {
        alert('BOOM!')
        location.reload()
    }
}
