function login() {
    let username = document.getElementById("username")
    localStorage.setItem("username", username.value)
    location.href = "bank.html"
}