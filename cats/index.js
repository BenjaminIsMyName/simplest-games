let container = document.getElementById('container')

async function call() {
    let data = await fetch('https://cataas.com/cat/gif')
    container.innerHTML = `
        <img height="300" src="${data.url}">
    `
}
