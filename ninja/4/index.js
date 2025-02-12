let display = document.getElementById('display')
let operand1 = ''
let operator = ''
let operand2 = ''

function numberClicked(n) {
    if (operator === '') {
        operand1 += n
    } else {
        operand2 += n
    }

    displayResult()
}

function operatorClicked(op) {
    if (operand1 === '') {
        alert('Please enter a number first!')
        return
    }
    operator = op
    displayResult()
}

function equalClicked() {
    if (operand1 && operator && operand2) {
        const result = calculate(
            parseFloat(operand1),
            operator,
            parseFloat(operand2)
        )
        operand1 = result.toString()
        operator = ''
        operand2 = ''
    }
    displayResult()
}

function dotClicked() {
    if (operator === '') {
        if (!operand1.includes('.')) {
            operand1 += '.'
        }
    } else {
        if (!operand2.includes('.')) {
            operand2 += '.'
        }
    }
    displayResult()
}

function clearCalc() {
    operand1 = ''
    operator = ''
    operand2 = ''

    displayResult()
}

function displayResult() {
    display.textContent = `${operand1} ${operator} ${operand2}`
}

function calculate(operand1, operator, operand2) {
    if (operator === '+') {
        return operand1 + operand2
    }

    if (operator === '-') {
        return operand1 - operand2
    }

    if (operator === '*') {
        return operand1 * operand2
    }

    if (operator === '/') {
        return operand1 / operand2
    }

    return 0
}
