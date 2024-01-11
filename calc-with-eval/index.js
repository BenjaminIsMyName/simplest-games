let display = document.getElementById('display')

function equalClicked() {
    display.innerHTML = eval(display.innerHTML)
}

function insert(value) {
    display.innerHTML += value
}

function clearCalc() {
    display.innerHTML = ''
}
