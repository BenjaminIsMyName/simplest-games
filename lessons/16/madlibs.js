let actor = document.getElementById('actor')
let food = document.getElementById('food')
let animal = document.getElementById('animal')
let adjective = document.getElementById('adjective')

let result = document.getElementById('result')

function create() {
    if (
        actor.value == '' ||
        food.value == '' ||
        animal.value == '' ||
        adjective.value == ''
    ) {
        result.innerHTML = 'אנא מלא את כל השדות'
        return
    }

    let stories = [
        `לפני שנים רבות היה ילד בשם ${actor.value} שחזר מהגן וראה על הושלחן בבית ${food.value} ואז הילד נגעל ורצה להקיא. הוא הקיא על חיית המחמד שלו, ${animal.value} והחיה הייתה מאוד ${adjective.value}`,
        `בגרמניה של שנות ה-30 השחקן ${actor.value} היה מאוד ${adjective.value}. כשהוא היה קטן חשבו שהוא דומה ל${animal.value}. `,
    ]
    let num = randomInteger(0, stories.length - 1)
    result.innerHTML = stories[num]
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
