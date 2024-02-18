let lionSound = new Audio('lion.wav')
let horseSound = new Audio('horse.wav')
let dogSound = new Audio('dog.wav')

function lion() {
    lionSound.play()
}

function horse() {
    horseSound.play()
}

function dog() {
    dogSound.play()
}

function makeSound() {
    let animal = document.getElementById('animal')
    let age = document.getElementById('age')
    if (animal.value == 'סוס') {
        horse()
    } else if (animal.value == 'אריה' && age.value < 8) {
        alert('אתה קטן מדי, זה יפחיד אותך')
    } else if (animal.value == 'אריה') {
        lion()
    } else if (animal.value == 'כלב' && age.value < 5) {
        alert('אתה קטן מדי, זה יפחיד אותך')
    } else if (animal.value == 'כלב') {
        dog()
    } else if (animal.value == 'דג' || animal.value == 'ג׳ירפה') {
        alert('חיה זו לא עושה צליל')
    } else {
        alert('חיה לא קיימת במערכת')
    }
}
