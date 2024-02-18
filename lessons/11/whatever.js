let total = document.getElementById('total')

let amount = 0

function change(num) {
    // alert(num)
    console.log(num)
    amount = amount + num
    total.innerHTML = amount
}
