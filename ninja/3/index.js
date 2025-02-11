/*

    באמצעות קוד זה אנו מציגים תמונת חתול

    אנו מציגים למשתמש את התקדמות טעינת התמונה

    בנוסף - אנו מציגים למשתמש הודעות טקסט שונות בזמן טעינת התמונה

*/

let container = document.getElementById('container')
let textArray = [
    'מנסה למצוא חתול...',
    'עדיין מחפש...',
    'כמעט שם...',
    'זה חתול ענק, לוקח זמן...',
]
let textIndex = 0
let intervalId

async function call() {
    container.innerHTML = `
        <h1 id="text">טוען...</h1>
        <div id="progress-container">
            <div id="progress-bar"></div>
        </div>
        <img 
            id="cat"
            height="300" 
            style="display: none"
        >
    `
    loadImageWithProgress(`https://cataas.com/cat/gif?${Math.random()}`)
    intervalId = setInterval(changeText, 3000)
}

function loadImageWithProgress(url) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            let percentComplete = (event.loaded / event.total) * 100
            document.getElementById('progress-bar').style.width =
                percentComplete + '%'
        }
    }

    xhr.onload = function () {
        if (xhr.status === 200) {
            let img = document.getElementById('cat')
            img.src = URL.createObjectURL(xhr.response)
            img.onload = onload
        }
    }

    xhr.send()
}

function onload() {
    document.getElementById('cat').style.display = 'block'
    document.getElementById('text').style.display = 'none'
    document.getElementById('progress-container').style.display = 'none'
    clearInterval(intervalId)
}

function changeText() {
    let textElement = document.getElementById('text')
    if (textElement) {
        textElement.innerText = textArray[textIndex]
        textIndex = (textIndex + 1) % textArray.length
    }
}
