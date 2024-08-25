// Get reference to the input element
let input = document.querySelector('input[type="text"]')

// Get references to all the buttons
let buttons = document.querySelectorAll('button')

// Add click event listeners to all the buttons
buttons.forEach(button => {
    button.addEventListener('click', () => {
        let buttonText = button.textContent
        if (buttonText.toUpperCase() === 'C') {
            // Handle clear button
            input.value = ''
        } else if (button.classList.contains('small')) {
            // Handle small buttons (+, -, *, /)
            input.value += ' ' + buttonText + ' '
        } else if (buttonText === '=') {
            // Handle equals button
            try {
                let result = eval(input.value)
                input.value = result
            } catch (error) {
                input.value = 'Error'
            }
        } else {
            // Handle number and decimal buttons
            input.value += buttonText
        }
    })
})
